-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: crudjson
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `idLOGIN` int NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(45) NOT NULL,
  `PASSWORD` varchar(45) NOT NULL,
  `TIPOUSUARIO` varchar(45) NOT NULL,
  PRIMARY KEY (`idLOGIN`),
  UNIQUE KEY `USERNAME` (`USERNAME`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'admin','1234','administrador');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tablajson`
--

DROP TABLE IF EXISTS `tablajson`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tablajson` (
  `idEjercicio` int NOT NULL AUTO_INCREMENT,
  `columnajson` json DEFAULT NULL,
  PRIMARY KEY (`idEjercicio`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tablajson`
--

LOCK TABLES `tablajson` WRITE;
/*!40000 ALTER TABLE `tablajson` DISABLE KEYS */;
INSERT INTO `tablajson` VALUES (1,'{\"drags\": [{\"valor\": \"Fidel Castro\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"George W. Bush\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Vidente Fox\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Ricardo Lagos\", \"imagen\": \"https://via.placeholder.com/150\"}], \"targets\": [{\"valor\": \"Mexico\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Chile\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Cuba\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Estados Unidos\", \"imagen\": \"https://via.placeholder.com/150\"}], \"pregunta\": \"Una simple pregunta de prueba1\", \"respuesta\": \"una simple respuesta de prueba1\"}'),(2,'{\"id\": \"2\", \"drags\": [{\"valor\": \"Fidel Castro\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"George W. Bush\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Vidente Fox\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Ricardo Lagos\", \"imagen\": \"https://via.placeholder.com/150\"}], \"targets\": [{\"valor\": \"Mexico\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Chile\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Cuba\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Estados Unidos\", \"imagen\": \"https://via.placeholder.com/150\"}], \"pregunta\": \"Una simple pregunta de prueba2\", \"respuesta\": \"una simple respuesta de prueba2\"}'),(3,'{\"id\": \"3\", \"drags\": [{\"valor\": \"Fidel Castro\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"George W. Bush\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Vidente Fox\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Ricardo Lagos\", \"imagen\": \"https://via.placeholder.com/150\"}], \"targets\": [{\"valor\": \"Mexico\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Chile\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Cuba\", \"imagen\": \"https://via.placeholder.com/150\"}, {\"valor\": \"Estados Unidos\", \"imagen\": \"https://via.placeholder.com/150\"}], \"pregunta\": \"Una simple pregunta de prueba3\", \"respuesta\": \"una simple respuesta de prueba3\"}');
/*!40000 ALTER TABLE `tablajson` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-17  6:02:06
