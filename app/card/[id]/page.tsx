'use client';

import MKGroupApp from '@/app/page';

type CardPageProps = {
  params: {
    id: string;
  };
};

export default function CardPage({ params }: CardPageProps) {
  const { id } = params;
  return <MKGroupApp showAccessPanel={false} builderId={id} />;
}
