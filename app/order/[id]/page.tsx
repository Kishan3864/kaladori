import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { access } from "node:fs/promises";
import path from "node:path";
import { Suspense } from "react";
import { OrderDetails, type PaymentInfo } from "@/components/order/order-details";
import { OrderSkeleton } from "@/components/order/order-skeleton";
import { getOrder } from "@/lib/server/orders";
import { upiConfig, upiLink, upiQrSvg } from "@/lib/server/payment";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

/** Optional static QR the owner can drop in when no UPI ID is configured. */
const STATIC_QR = "/payment/upi-qr.png";

async function hasStaticQr() {
  try {
    await access(path.join(process.cwd(), "public", "payment", "upi-qr.png"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Order confirmation and payment. The id in the URL is the unguessable key,
 * so the order renders at request time inside Suspense; the shell is static.
 */
export default function OrderPage(props: OrderPageProps) {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderView params={props.params} />
    </Suspense>
  );
}

async function OrderView({ params }: { params: OrderPageProps["params"] }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  let payment: PaymentInfo | null = null;
  if (order.status === "pending_payment" || order.status === "payment_submitted") {
    const qrSvg = await upiQrSvg(order.total, order.number);
    payment = {
      qrSvg,
      staticQr: qrSvg ? null : (await hasStaticQr()) ? STATIC_QR : null,
      upiId: upiConfig().id || null,
      upiHref: upiLink(order.total, order.number),
    };
  }

  return <OrderDetails order={order} payment={payment} />;
}
