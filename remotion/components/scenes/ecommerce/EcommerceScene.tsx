import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CameraShot } from "../Camera";
import { Camera } from "../Camera";
import { Cursor, type CursorStop } from "../Cursor";
import { Screen, SCENE } from "../shared";
import { AdminScreen } from "./Admin";
import { CheckoutScreen } from "./Checkout";
import { BEATS } from "./data";
import { BOARD, OrderBoardScreen } from "./OrderBoard";
import { HomeScreen, ResultsScreen } from "./Storefront";

const camShots: CameraShot[] = [
  { t: BEATS.start, zoom: 1, x: SCENE.width / 2, y: SCENE.height / 2 },
  { t: BEATS.typeStart, zoom: 1.6, x: 450, y: 60 },
  { t: BEATS.results, zoom: 1, x: SCENE.width / 2, y: SCENE.height / 2 },
  { t: BEATS.addToCart, zoom: 1.4, x: 110, y: 260 },
  { t: BEATS.cartClick, zoom: 1, x: SCENE.width / 2, y: SCENE.height / 2 },
  { t: BEATS.frontEnd, zoom: 1, x: SCENE.width / 2, y: SCENE.height / 2 },
  { t: BEATS.placeOrder, zoom: 1.3, x: 630, y: 220 },
  { t: BEATS.backEnd, zoom: 1.5, x: BOARD.backEnd.x + BOARD.backEnd.w / 2, y: BOARD.backEnd.y + BOARD.backEnd.h / 2 },
  { t: BEATS.payments, zoom: 1.5, x: BOARD.payments.x + BOARD.payments.w / 2, y: BOARD.payments.y + BOARD.payments.h / 2 },
  { t: BEATS.shipping, zoom: 1.5, x: BOARD.shipping.x + BOARD.shipping.w / 2, y: BOARD.shipping.y + BOARD.shipping.h / 2 },
  { t: BEATS.gst, zoom: 1.5, x: BOARD.gst.x + BOARD.gst.w / 2, y: BOARD.gst.y + BOARD.gst.h / 2 },
  { t: BEATS.admin, zoom: 1, x: SCENE.width / 2, y: SCENE.height / 2 },
];

const cursorPath: CursorStop[] = [
  { t: BEATS.typeStart - 0.1, x: 400, y: 300 },
  { t: BEATS.typeStart, x: 460, y: 60, click: true },
  { t: BEATS.searchClick, x: 680, y: 60, click: true },
  { t: BEATS.results + 0.3, x: 110, y: 350 },
  { t: BEATS.addToCart, x: 110, y: 376, click: true },
  { t: BEATS.cartClick, x: 740, y: 28, click: true },
  { t: BEATS.placeOrder, x: 630, y: 240, click: true },
  { t: BEATS.paid, x: 590, y: 170, click: true },
];

export function EcommerceScene({ t }: { t: number }) {
  return (
    <Camera t={t} shots={camShots} width={SCENE.width} height={SCENE.height}>
      <Screen t={t} start={BEATS.start} end={BEATS.results - 0.05}>
        <HomeScreen t={t} />
      </Screen>
      <Screen t={t} start={BEATS.results - 0.1} end={BEATS.frontEnd - 0.1}>
        <ResultsScreen t={t} />
      </Screen>
      <Screen t={t} start={BEATS.frontEnd - 0.15} end={BEATS.backEnd - 0.1}>
        <CheckoutScreen t={t} />
      </Screen>
      <Screen t={t} start={BEATS.backEnd - 0.15} end={BEATS.admin - 0.1}>
        <OrderBoardScreen t={t} />
      </Screen>
      <Screen t={t} start={BEATS.admin - 0.15} end={BEATS.end + 0.5}>
        <AdminScreen t={t} />
      </Screen>
      <Cursor t={t} path={cursorPath} />
    </Camera>
  );
}
