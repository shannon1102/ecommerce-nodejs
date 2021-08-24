-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th8 20, 2021 lúc 10:37 PM
-- Phiên bản máy phục vụ: 8.0.23
-- Phiên bản PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cameradb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `name` varchar(1000) NOT NULL,
  `description` mediumtext,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `create_at`, `update_at`, `slug`) VALUES
(1, 'cate1', 'desc', '2021-08-20 10:37:34', '2021-08-20 10:37:34', 'hoavanhoavan'),
(2, 'cate2', 'desc2', '2021-08-20 10:37:52', '2021-08-20 10:37:52', 'hoavanhoavanaloalo'),
(3, 'string', 'string', '2021-08-20 13:35:57', '2021-08-20 13:35:57', ''),
(8, 'string', 'string', '2021-08-20 16:35:19', '2021-08-20 16:35:19', 'string-1629452119986'),
(10, 'string văn căn xxx @ [', '1', '2021-08-20 16:39:10', '2021-08-20 16:39:10', 'string-van-can-xxx-1629452525247');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contact`
--

CREATE TABLE `contact` (
  `id` int NOT NULL,
  `name` int NOT NULL,
  `address` int DEFAULT NULL,
  `basic_information` int DEFAULT NULL,
  `phone` int DEFAULT NULL,
  `zalo` int DEFAULT NULL,
  `facebook` int DEFAULT NULL,
  `url_image` int DEFAULT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hot_product`
--

CREATE TABLE `hot_product` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `hot_product`
--

INSERT INTO `hot_product` (`id`, `product_id`, `create_at`, `update_at`) VALUES
(2, 6, '2021-08-20 13:02:39', '2021-08-20 13:02:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `inquiry`
--

CREATE TABLE `inquiry` (
  `id` int NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(100) NOT NULL,
  `product_id` int NOT NULL,
  `message` text NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `product_name` varchar(1000) DEFAULT NULL,
  `product_link` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `inquiry`
--

INSERT INTO `inquiry` (`id`, `customer_name`, `email`, `phone`, `product_id`, `message`, `create_at`, `update_at`, `product_name`, `product_link`) VALUES
(3, 'string', 'string', 'string', 2, 'string', '2021-08-20 22:29:46', '2021-08-20 22:29:46', 'string', 'string'),
(4, 'string', 'string', 'string', 2, 'string', '2021-08-20 22:31:29', '2021-08-20 22:31:29', 'string', 'string'),
(5, 'string', 'string', 'string', 2, 'string', '2021-08-20 22:32:21', '2021-08-20 22:32:21', 'string', 'string');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post`
--

CREATE TABLE `post` (
  `id` int NOT NULL,
  `title` varchar(1000) NOT NULL,
  `url_image` varchar(1000) DEFAULT NULL,
  `content` mediumtext,
  `tag_id` int NOT NULL,
  `slug` varchar(500) NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `title`, `url_image`, `content`, `tag_id`, `slug`, `create_at`, `update_at`) VALUES
(1, 'string', 'string', 'string', 1, 'string-1629458167721', '2021-08-20 18:16:07', '2021-08-20 18:16:07'),
(5, 'string dfdsfsfds', 'string', 'string', 5, 'string-dfdsfsfds-1629469626500', '2021-08-20 21:27:06', '2021-08-20 21:27:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `name` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  `detail` text,
  `price` bigint NOT NULL,
  `discount` int DEFAULT '0',
  `category_id` int NOT NULL,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `slug` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `detail`, `price`, `discount`, `category_id`, `create_at`, `update_at`, `slug`) VALUES
(2, 'string', 'string', 'string', 11110, 20, 1, '2021-08-20 10:52:30', '2021-08-20 10:52:30', 'stringxxxxx3456'),
(3, 'string3', 'string', 'string', 123000, 20, 1, '2021-08-20 11:00:38', '2021-08-20 11:00:38', 'string31629432038949'),
(6, 'string3', 'string', 'string', 123000, 20, 1, '2021-08-20 11:03:07', '2021-08-20 11:03:07', 'string31629432187337'),
(7, 'string3', 'string', 'string', 125000, 23, 1, '2021-08-20 11:03:23', '2021-08-20 11:03:23', 'string31629432203857'),
(8, 'string sgsg aAddd@ aawă  ád', 'string', 'string', 1110, 10, 1, '2021-08-20 13:37:30', '2021-08-20 13:37:30', 'string-sgsg-aaddd-aawa-ad1629441450901'),
(9, 'string sgsg aAddd@ aawă  ád', 'string', 'string', 1110, 10, 1, '2021-08-20 13:44:35', '2021-08-20 13:44:35', 'string-sgsg-aaddd-aawa-ad1629441875266');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_image`
--

CREATE TABLE `product_image` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `url_image1` varchar(1000) DEFAULT NULL,
  `url_image2` varchar(1000) DEFAULT NULL,
  `url_image3` varchar(1000) DEFAULT NULL,
  `url_image4` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product_image`
--

INSERT INTO `product_image` (`id`, `product_id`, `url_image1`, `url_image2`, `url_image3`, `url_image4`) VALUES
(1, 1, 'string', NULL, NULL, NULL),
(2, 2, 'string', NULL, NULL, NULL),
(3, 3, 'string', NULL, NULL, NULL),
(4, 4, 'string', NULL, NULL, NULL),
(5, 6, 'string', NULL, NULL, NULL),
(6, 7, 'string', NULL, NULL, NULL),
(7, 8, 'string', NULL, NULL, NULL),
(8, 9, 'string', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tag`
--

CREATE TABLE `tag` (
  `id` int NOT NULL,
  `name` varchar(1000) NOT NULL,
  `slug` varchar(1000) NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `tag`
--

INSERT INTO `tag` (`id`, `name`, `slug`, `create_at`, `update_at`) VALUES
(1, 'string asdada 3442 WE@', 'string-asdada-3442-we-1629458120088', '2021-08-20 18:15:20', '2021-08-20 18:15:20'),
(3, 'string okla anananf', 'string-okla-anananf-1629469359509', '2021-08-20 18:15:24', '2021-08-20 18:15:24'),
(5, 'string ###yy %% 22@', 'string-###yy-percentpercent-22-1629469374758', '2021-08-20 21:22:54', '2021-08-20 21:22:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `password`, `role`) VALUES
(3, 'string', 'string', '$2a$08$WBkFNWceMk5orKBIKMPq.uHjM1oVZgslVCSCU4OwGk0Kc7Ne.AX2K', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `hot_product`
--
ALTER TABLE `hot_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `inquiry`
--
ALTER TABLE `inquiry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hot_product`
--
ALTER TABLE `hot_product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `inquiry`
--
ALTER TABLE `inquiry`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `post`
--
ALTER TABLE `post`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `product_image`
--
ALTER TABLE `product_image`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `hot_product`
--
ALTER TABLE `hot_product`
  ADD CONSTRAINT `hot_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `inquiry`
--
ALTER TABLE `inquiry`
  ADD CONSTRAINT `inquiry_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
