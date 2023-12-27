type BrandContinents = {
   href: string;
   text: string;
   image: string;
}[];

const brand : Record<string, BrandContinents> = {
   dtdd: [
      {
         text: "Tất cả",
         href: "",
         image: "",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-iphone-220x48.png",
         text: "iPhone",
         href: "iphone",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/samsungnew-220x48-1.png",
         text: "Samsung",
         href: "samsung",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-xiaomi-220x48-5.png",
         text: "Xiaomi",
         href: "xiaomi",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/Realme42-b_37.png",
         text: "Realme",
         href: "realme",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/Nokia42-b_21.jpg",
         text: "Nokia",
         href: "nokia",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/vivo-logo-220-220x48-3.png",
         text: "Vivo",
         href: "vivo",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/OPPO42-b_5.jpg",
         text: "Oppo",
         href: "oppo",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/tcl-logo-lon-220x48.jpg",
         text: "Tcl",
         href: "tcl",
      },
   ],
   laptop: [
      {
         text: "Tất cả",
         href: "",
         image: ''
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-macbook-149x40.png",
         text: "Macbook",
         href: "macbook",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-asus-149x40.png",
         text: "Asus",
         href: "asus",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-hp-149x40-1.png",
         text: "Hp",
         href: "hp",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-lenovo-149x40.png",
         text: "Lenovo",
         href: "lenovo",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-acer-149x40.png",
         text: "Acer",
         href: "acer",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-dell-149x40.png",
         text: "Dell",
         href: "dell",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-msi-149x40.png",
         text: "Msi",
         href: "msi",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-surface-149x40-1.png",
         text: "Surface",
         href: "surface",
      },
      {
         image: "https://cdn.tgdd.vn/Brand/1/logo-lg-149x40.png",
         text: "Lg",
         href: "lg",
      },
   ],
};

const demand = {
   laptop: [
      {
         text: "Gaming",
         href: "gaming",
      },
      {
         text: "Học Tập - Văn phòng",
         href: "hoc-tap-van-phong",
      },
      {
         text: "Đồ họa - Kỹ thuật",
         href: "do-hoa-ky-thuat",
      },
      {
         text: "Mỏng nhẹ",
         href: "mong-nhe",
      },
      {
         text: "Cao cấp - Sang trọng",
         href: "cao-cap-sang-trong",
      },
   ],
   dtdd: [
      {
         text: "Tất cả",
         href: "tat-ca",
      },
      {
         text: "Chơi game - Cấu hình cao",
         href: "choi-game",
      },
      {
         text: "Chụp ảnh - Quay phim",
         href: "hoc-tap-van-phong",
      },
      {
         text: "Nhỏ gọn",
         href: "nho-gon",
      },
      {
         text: "Mỏng nhẹ",
         href: "mong-nhe",
      },
   ],
};

export { brand, demand };
