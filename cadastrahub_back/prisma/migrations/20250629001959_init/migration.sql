-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('customer', 'supplier');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('ALUMINIO', 'COBRE', 'CHUMBO', 'MAGNESIO', 'NICKEL', 'INOX', 'LATAO', 'BRONZE', 'ZINCO');

-- CreateEnum
CREATE TYPE "AluminioSubtype" AS ENUM ('P1020', 'CABO', 'PERFIL_LIMPO', 'ESTAMPARIA_MOLE_MISTA', 'PANELA_LIMPA', 'RODA', 'CHAPA_SOLTA_PRENSADA', 'PISTAO', 'BLOCO_LIMPO_MISTO', 'LATA_SOLTA', 'LATA_PRENSADA', 'LIGA_SAE_305', 'LIGA_SAE_306', 'LIGA_SAE_309_323', 'DEOX', 'ZAMAC', 'TARUGO', 'PERFIL_NOVO', 'LAMINADOS', 'LAMINA_6MM', 'DISCO');

-- CreateEnum
CREATE TYPE "CobreSubtype" AS ENUM ('COBRE_1A', 'COBRE_MISTO', 'RADIADOR', 'AL_CU');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "category" "CategoryType" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "type" "MaterialType" NOT NULL,
    "subtypeAluminio" "AluminioSubtype",
    "subtypeCobre" "CobreSubtype",
    "quantity_tonelada" DECIMAL(65,30) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpfCnpj_key" ON "User"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
