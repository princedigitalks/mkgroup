import React from 'react';
import MKGroupApp from '@/components/MKGroupApp';
import { Metadata } from 'next';

type CardPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";
    const response = await fetch(`${apiUrl}/builder/${id}`);
    const result = await response.json();
    
    if (result.status === "Success") {
      const builder = result.data;
      const baseUrl = apiUrl.split("/v1/api")[0];
      const imageUrl = builder.profileImage 
        ? `${baseUrl}/builder/${builder.profileImage}` 
        : builder.logo 
          ? `${baseUrl}/builder/${builder.logo}` 
          : "";

      return {
        title: builder.name || "MK GROUP",
        description: `${builder.companyName || ""} - ${builder.designation || ""}\nPhone: ${builder.number || ""}`,
        openGraph: {
          title: builder.name || "MK GROUP",
          description: builder.companyName || "",
          images: imageUrl ? [{ url: imageUrl }] : [],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: builder.name || "MK GROUP",
          description: builder.companyName || "",
          images: imageUrl ? [imageUrl] : [],
        },
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  return {
    title: "MK GROUP",
    description: "Digital Business Card",
  };
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;
  return <MKGroupApp showAccessPanel={false} builderId={id} />;
}
