// Global type definitions
import React from 'react';

export interface Product {
  id: number | string;
  title?: string;
  name?: string;
  src?: string;
  imgSrc?: string;
  alt?: string;
  delay?: string;
  wowDelay?: string;
  price: number;
  tooltip?: string;
  [key: string]: any; // Allow additional properties
}

export interface Category {
  id: number | string;
  name: string;
  slug?: string;
  image?: string;
  [key: string]: any;
}

export interface MenuItem {
  id: number | string;
  title: string;
  href?: string;
  subItems?: MenuItem[];
  [key: string]: any;
}

// Allow any additional properties on all objects
declare global {
  interface Window {
    [key: string]: any;
  }
}

export {}; 