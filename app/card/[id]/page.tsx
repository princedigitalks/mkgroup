import React from 'react';
import MKGroupApp from '@/components/MKGroupApp';

type CardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function CardPage({ params }: CardPageProps) {
  const { id } = React.use(params);
  return <MKGroupApp showAccessPanel={false} builderId={id} />;
}
