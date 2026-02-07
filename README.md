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

setiap file dipisahkan berdasarkan fitur yang ada, karena agar mudah untuk dikembangkan jika kedepannya ada fitur baru. dan juga agar mudah untuk di maintain. serta agar mudah untuk di testing, dengan mudah. Disetiap module tersebut terdapat file controller, module, dan service terkecuali untuk tasks ada DTO yang bertujuan menyaring atau memfilter, hal ini bertujuan untuk mencoba apakah DTO berhasil karena dari awal harus mencantumkan tittle dan description namun yang ada hanya tittle dan berhasil dengan baik hanya tittle yang muncul dan description nya tidak ada.
beberapa point secara singkat mengenai alasan memilih pattern modular tersebut yang dapat penulis pahami adalah:

1. Separation of Concerns (Pemisahan Tanggung Jawab)
   Setiap module hanya fokus pada satu fitur saja. Auth module hanya menangani authentication, tasks module hanya menangani CRUD tasks. Hal ini membuat kode lebih mudah dibaca dan dipahami.
2. Scalability (Mudah Dikembangkan)
   Jika ingin menambah fitur baru seperti categories atau tags, cukup buat module baru tanpa mengubah kode yang sudah ada. Module baru tidak akan mengganggu module lain yang sudah berjalan.
3. Maintainability (Mudah Dipelihara)
   Jika ada bug di fitur tasks, cukup cek folder tasks/ saja. Tidak perlu mencari di banyak folder berbeda sehingga mempercepat proses debugging.
4. Reusability (Bisa Digunakan Ulang)
   Module bisa dipakai di project lain. Contohnya auth module bisa dicopy ke project lain yang membutuhkan JWT authentication.
5. Testability (Mudah Ditesting)
   Setiap module bisa ditest secara terpisah. Unit test dan E2E test lebih mudah dibuat karena module terisolasi satu sama lain.

//CARA MENJALANKANNYA

1. Clone Repository <https://github.com/abdulazisbur/task-api.git>
2. cd task-api
3. install dependency : npm install
4. create database di MySQL: CREATE DATABASE task_api_db;
5. "npm run start:dev" dan server berjalan di "http://localhost:3000"

//BEBERAPA PERINTAH YANG SERING SAYA GUNAKAN

- npm run start:dev
- npm run test:e2e
- npm run build

//ENDPOINT UTAMA

untuk authen

POST/auth/register

{
   "email": "......@...com"
   "password":123456"
}

POST/auth/login

{
   "email": "......@...com"
   "password":123456"
}

untuk task disini harus menginput token yang telah di generate dari login

GET /tasks

POST /tasks

PUT /tasks/:id

DELETE /tasks/:id


//E2E

Project ini sudah menggunakan E2E testing untuk mengecek login and token, akses endpoint protected, CRUD task, dan isolasi data antar user untuk menjalaknkannya menggunakan "npm run test:e2e" dan jika berhasil akan PASS.


//HAL-HAL YANG PENULIS MENGERTI DALAM PROJECT INI

Sebagai catatan pribadi dalam project ini penulis memahami aalur backend
ksususnya dalam cara kerja JWT(Json Web Token), relasi database, depefency injection dalam NestJS, dan juga penulis memahami cara testing API selain itu sih banyak yang dipelajari dan masih bisa dikembangkan namun project ini hanya menjadi dasar pembelajaran penulis.




