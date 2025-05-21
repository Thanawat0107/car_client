'use client';

import { Car } from '@/types/dto/Car';
import CarForm from './CarForm';
import { useRouter } from 'next/navigation';
import { useCreateCarMutation, useUpdateCarMutation } from '@/services/carApi';

export default function CarUpsert({ car }: { car?: Car }) {
  const router = useRouter();
  const [createCar] = useCreateCarMutation();
  const [updateCar] = useUpdateCarMutation();

  const handleSubmit = async (formData: FormData) => {
    try {
      if (car) {
        await updateCar({ id: car.id, data: formData }).unwrap();
      } else {
        await createCar(formData);
      }
      router.push('/car');
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  return <CarForm initialData={car} onSubmit={handleSubmit} />;
}
