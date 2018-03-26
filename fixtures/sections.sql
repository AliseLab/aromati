-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.2.13-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table landing.sections
DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `name` varchar(32) NOT NULL,
  `language` varchar(32) NOT NULL,
  `order` int(4) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  PRIMARY KEY (`name`,`language`),
  KEY `order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table landing.sections: ~0 rows (approximately)
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT IGNORE INTO `sections` (`name`, `language`, `order`, `title`, `data`) VALUES
	('about_us', 'en', 1, 'About Us', '<h1>About Us</h1><p>sjdfghsdgfhsdgvhgvhxcgvhxcgvsdv</p>'),
	('about_us', 'ru', 1, 'О нас', '<h1>О нас</h1><p>фыаиыпыапываырвпырваырпва</p>'),
	('services', 'en', 2, 'Services', '<h1>Services</h1><ul><li>sjdfhjsdhfsd</li><li>ervfg4ygfdhgdfg</li></ul>'),
	('services', 'ru', 2, 'Услуги', '<h1>Услуги</h1><ul><li>гнрктиапркопрп</li><li>авпрвроваоывпвпавпл</li></ul>');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
