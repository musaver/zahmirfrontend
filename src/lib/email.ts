export async function sendTextEmail(to: string, subject: string, text: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Musaver', email: 'musaver@lmsyl.shop' },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Brevo Error:', error);
    throw new Error(error.message || 'Failed to send email');
  }

  return await res.json();
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Musaver', email: 'musaver@lmsyl.shop' },
      to: [{ email: to }],
      subject: 'Welcome to the Platform!',
      textContent: `Hello${name ? ` ${name}` : ''}, thanks for signing up!`,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Failed to send email via Brevo:', error);
    throw new Error(error.message || 'Brevo email failed');
  }

  return await res.json();
}

export async function sendOrderConfirmationEmail(
  to: string, 
  orderNumber: string, 
  customerName: string, 
  orderTotal: number,
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    variations?: string;
    addons?: string;
  }>
) {
  const itemsText = orderItems.map(item => {
    let itemText = `• ${item.productName} (Qty: ${item.quantity}) - Rs${item.price.toFixed(2)}`;
    if (item.variations) {
      itemText += `\n  Variations: ${item.variations}`;
    }
    if (item.addons) {
      itemText += `\n  Add-ons: ${item.addons}`;
    }
    return itemText;
  }).join('\n\n');

  const emailText = `
Dear ${customerName},

Thank you for your order! We've received your order and it's being processed.

Order Details:
Order Number: ${orderNumber}
Total Amount: Rs${orderTotal.toFixed(2)}

Items Ordered:
${itemsText}

Your order status is currently "Pending" and will be updated once our team reviews and approves it.

You'll receive another email when your order status changes.

If you have any questions about your order, please contact us and reference your order number.

Thank you for choosing our services!

Best regards,
Musaver Team
  `.trim();

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Musaver', email: 'musaver@lmsyl.shop' },
      to: [{ email: to }],
      subject: `Order Confirmation - ${orderNumber}`,
      textContent: emailText,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Failed to send order confirmation email via Brevo:', error);
    throw new Error(error.message || 'Order confirmation email failed');
  }

  return await res.json();
}
