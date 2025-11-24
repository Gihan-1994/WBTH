-- CreateTable
CREATE TABLE "tourists" (
    "user_id" TEXT NOT NULL,
    "country" TEXT,
    "dob" TIMESTAMP(3),

    CONSTRAINT "tourists_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "tourists" ADD CONSTRAINT "tourists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
