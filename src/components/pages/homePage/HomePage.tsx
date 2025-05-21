'use client';

import React from 'react'

import Bennder from '@/components/layouts/Bennder'
import CarPage from '../carPage/CarPage';
import BrandPage from '../brandPage/BrandPage';
import TypePage from '../typePage/TypePage';

export default function HomePage() {
  return (
    <>
      <Bennder />
      <CarPage />
      <TypePage />
      <BrandPage />
    </>
  );
}