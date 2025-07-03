'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

interface Service {
  number: string;
  icon: string;
  title: string;
  description: string;
  slug: string;
}

export default function OurServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const categories: Category[] = await response.json();
          
          // Combine dynamic categories with static service data
          const combinedServices: Service[] = categories.map((category, index) => ({
            number: String(index + 1).padStart(2, '0'),
            icon: "/assets/img/icon/service_card_1.svg",
            title: category.name, // Dynamic title from categories
            description: "Professional service description goes here.",
            slug: category.slug // Dynamic slug from categories
          }));
          
          setServices(combinedServices);
        } else {
          console.error('Failed to fetch categories');
          // Fallback to original static data if API fails
          setServices([
            { number: "01", icon: "/assets/img/icon/service_card_8.svg", title: "AC Cleaning", description: "Keep your indoor air fresh and your AC system running efficiently. We offer basic filter cleaning, duct and coil deep cleaning, and full system servicing — including professional AC repairs.", slug: "ac-cleaning" },
            { number: "02", icon: "/assets/img/icon/service_card_6.svg", title: "Handyman Services", description: "Need a hand around the house? Our handyman services cover everything from mounting and drilling to curtain, light, and furniture installations. Pay hourly or per task.", slug: "handyman-services" },
            { number: "03", icon: "/assets/img/icon/service_card_1.svg", title: "Plumbing Services", description: "From leaky taps to blocked drains, our certified plumbers ensure quick, clean, and reliable solutions. We also handle toilet repairs, water heater installations, and pump fixes.", slug: "plumbing-services" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to original static data if API fails
        setServices([
          { number: "01", icon: "/assets/img/icon/service_card_8.svg", title: "AC Cleaning", description: "Keep your indoor air fresh and your AC system running efficiently. We offer basic filter cleaning, duct and coil deep cleaning, and full system servicing — including professional AC repairs.", slug: "ac-cleaning" },
          { number: "02", icon: "/assets/img/icon/service_card_6.svg", title: "Handyman Services", description: "Need a hand around the house? Our handyman services cover everything from mounting and drilling to curtain, light, and furniture installations. Pay hourly or per task.", slug: "handyman-services" },
          { number: "03", icon: "/assets/img/icon/service_card_1.svg", title: "Plumbing Services", description: "From leaky taps to blocked drains, our certified plumbers ensure quick, clean, and reliable solutions. We also handle toilet repairs, water heater installations, and pump fixes.", slug: "plumbing-services" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Shop</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of Categories
          </p>
        </div>
      </div>

      <section className="flat-spacing-1">
        <div className="container">
          {loading ? (
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="tf-grid-layout lg-col-3 tf-col-2">
              {services.map((service, index) => (
                <div className="collection-item hover-img" key={index}>
                  <div className="collection-inner">
                    <Link
                      href={`/category/${service.slug}`}
                      className="collection-image img-style"
                    >
                      <Image
                        className="lazyload"
                        data-src={`/images/collections/collection-9.jpg`}
                        alt={service.title}
                        src={`/images/collections/collection-9.jpg`}
                        width={460}
                        height={460}
                      />
                    </Link>
                    <div className="collection-content">
                      <Link
                        href={`/category/${service.slug}`}
                        className="tf-btn collection-title hover-icon"
                      >
                        <span>{service.title}</span>
                        <i className="icon icon-arrow1-top-left" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
} 