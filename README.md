//Task API (NestJS + MySQL)

Awalnya project ini dibuat untuk latihan NestJS, dalam prosesnya saya juga belajar banyak tentang JWT, database relasi, dan testing API. Selama pengerjaan, saya beberapa kali mengalami error (JWT error, database error, relasi error, dll),karena terlibat langsung, dari situ saya jadi lebih paham alurnya.

--------------------------------------------------------------------------------------------------------------------

//About Project inih

Aplikasi ini adalah REST API sederhana untuk manajemen task.
Fitur utama:
- Register dan login user
- Autentikasi menggunakan JWT
- CRUD task (Create, Read, Update, Delete)
- Setiap user hanya bisa mengakses task miliknya sendiri
- Endpoint task dilindungi oleh token

--------------------------------------------------------------------------------------------------------------------

//Teknologi yang Digunakan dalam project ini

- NestJS
- TypeScript
- MySQL
- TypeORM
- JWT + Passport
- Jest & Supertest
- Postman

--------------------------------------------------------------------------------------------------------------------

//Struktur Project

Project ini menggunakan struktur modular bawaan NestJS.
Setiap fitur dipisah menjadi module:
src/
|-auth
|-tasks
|-users

Disetiap module tersebut terdapat file yang controller, module, dan service terkecuali untuk tasks ada DTO yang bertujuan menyaring atau memfillter, hal ini bertujuan untuk mencoba apakah DTO berhasil karena dari awal harus mencantumkan tittle dan description namun yang ada hanya tittle dan berhasil dengan baik hanya tittle yang muncul dan description nya tidak ada

//CARA MENJALANKANNYA

1. Clone Repository 
