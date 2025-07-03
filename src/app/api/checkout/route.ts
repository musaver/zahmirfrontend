import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, 
      phone, 
      address, 
      cartItems,
      subtotal,
      total
    } = body;

    // Validate required fields
    if (!name || !phone || !address || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, phone, address, or cart items' 
      }, { status: 400 });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const orderId = uuidv4();

    // Create order
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId: session.user.id,
      email: session.user.email!,
      phone,
      status: 'pending',
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending',
      subtotal: subtotal.toString(),
      taxAmount: '0.00',
      shippingAmount: '0.00',
      discountAmount: '0.00',
      totalAmount: total.toString(),
      currency: 'USD',
      
      // Use name for both billing and shipping names
      billingFirstName: name.split(' ')[0] || name,
      billingLastName: name.split(' ').slice(1).join(' ') || '',
      billingAddress1: address,
      billingCity: '', // Can be extracted from address if needed
      billingState: '',
      billingPostalCode: '',
      billingCountry: 'US',
      
      shippingFirstName: name.split(' ')[0] || name,
      shippingLastName: name.split(' ').slice(1).join(' ') || '',
      shippingAddress1: address,
      shippingCity: '',
      shippingState: '',
      shippingPostalCode: '',
      shippingCountry: 'US',
    });

    // Create order items
    const orderItemsToInsert = cartItems.map((item: any) => {
      // Create variation title from selected variations
      let variantTitle: string | null = null;
      if (item.selectedVariations && Object.keys(item.selectedVariations).length > 0) {
        variantTitle = Object.entries(item.selectedVariations)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
      }

      // Store addons data
      let addonsData: any[] | null = null;
      if (item.selectedAddons && Array.isArray(item.selectedAddons) && item.selectedAddons.length > 0) {
        addonsData = item.selectedAddons;
      }

      // Calculate total price including addons
      const basePrice = item.productPrice * item.quantity;
      const addonsPrice = (addonsData && Array.isArray(addonsData))
        ? addonsData.reduce((sum: number, addon: any) => 
            sum + ((addon.price || 0) * (addon.quantity || 1)), 0)
        : 0;
      const totalItemPrice = basePrice + addonsPrice;

      const orderItem = {
        id: uuidv4(),
        orderId,
        productId: item.productId,
        productName: item.productTitle,
        variantTitle: variantTitle,
        quantity: item.quantity,
        price: item.productPrice.toString(),
        totalPrice: totalItemPrice.toString(),
        productImage: item.productImage || null,
        addons: addonsData,
      };

      return orderItem;
    });

    await db.insert(orderItems).values(orderItemsToInsert);

    // Prepare email data
    const emailItems = cartItems.map((item: any) => ({
      productName: item.productTitle,
      quantity: item.quantity,
      price: item.productPrice * item.quantity,
      variations: item.selectedVariations && Object.keys(item.selectedVariations).length > 0
        ? Object.entries(item.selectedVariations)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
        : '',
      addons: item.selectedAddons && item.selectedAddons.length > 0
        ? item.selectedAddons
            .map((addon: any) => `${addon.title || addon.name} (${addon.quantity || 1}x)`)
            .join(', ')
        : ''
    }));

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(
        session.user.email!,
        orderNumber,
        name,
        total,
        emailItems
      );
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      message: 'Order placed successfully!'
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
} 