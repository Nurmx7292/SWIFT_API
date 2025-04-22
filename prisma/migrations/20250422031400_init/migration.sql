-- CreateTable
CREATE TABLE "Country" (
    "iso2Code" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("iso2Code")
);

-- CreateTable
CREATE TABLE "SwiftCode" (
    "swiftCode" CHAR(11) NOT NULL,
    "bankName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isHeadquarter" BOOLEAN NOT NULL,
    "countryIso2" TEXT NOT NULL,

    CONSTRAINT "SwiftCode_pkey" PRIMARY KEY ("swiftCode")
);

-- AddForeignKey
ALTER TABLE "SwiftCode" ADD CONSTRAINT "SwiftCode_countryIso2_fkey" FOREIGN KEY ("countryIso2") REFERENCES "Country"("iso2Code") ON DELETE RESTRICT ON UPDATE CASCADE;
