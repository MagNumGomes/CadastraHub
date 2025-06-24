-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `cpfCnpj` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `category` ENUM('customer', 'supplier') NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_cpfCnpj_key`(`cpfCnpj`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('ALUMINIO', 'COBRE', 'CHUMBO', 'MAGNESIO', 'NICKEL', 'INOX', 'LATAO', 'BRONZE', 'ZINCO') NOT NULL,
    `subtypeAluminio` ENUM('P1020', 'CABO', 'PERFIL_LIMPO', 'ESTAMPARIA_MOLE_MISTA', 'PANELA_LIMPA', 'RODA', 'CHAPA_SOLTA_PRENSADA', 'PISTAO', 'BLOCO_LIMPO_MISTO', 'LATA_SOLTA', 'LATA_PRENSADA', 'LIGA_SAE_305', 'LIGA_SAE_306', 'LIGA_SAE_309_323', 'DEOX', 'ZAMAC', 'TARUGO', 'PERFIL_NOVO', 'LAMINADOS', 'LAMINA_6MM', 'DISCO') NULL,
    `subtypeCobre` ENUM('COBRE_1A', 'COBRE_MISTO', 'RADIADOR', 'AL_CU') NULL,
    `quantity_tonelada` DECIMAL(65, 30) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
