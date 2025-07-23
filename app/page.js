import Image from "next/image";
import styles from "./page.module.css";

import Home from "@/components/home/Home";

import Why from "@/components/why/Why";
import DailyOff from "@/components/dailyoffer/DailyOff";

import Menu from "@/components/menu/Menu";
import Banner from "@/components/banner/Banner";
import Test from "@/components/test/Testimonial";

import Counter from "@/components/counter/Counter";
import Chef from "@/components/chef/Chef";
import Blog from "@/components/blogpage/Blog";
export default function Homes() {
  return (
    <main>
      <Home />
      <Why />

      <DailyOff />

      <Menu />
      <Banner />
      <Test />
      <Counter />
      <Chef />
      <Blog />
    </main>
  );
}
