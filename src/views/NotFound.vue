<template>
  <div class="text-center fs-1 my-5 text-danger">
    <div class="compass"></div>
    <div class="message">Looks like you’re lost.</div>
  </div>
</template>

<style scoped>
        .compass {
            width: 100px;
            height: 100px;
            border: 5px solid #333;
            border-radius: 50%;
            position: relative;
            margin: 100px auto;
            background-color: #f9f9f9;
            animation: spin 3s linear infinite;
        }
        .compass::after {
            content: '';
            width: 10px;
            height: 50px;
            background-color: #333;
            position: absolute;
            top: 25px;
            left: 45px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .message {
            text-align: center;
            font-size: 18px;
            color: #333;
            margin-top: 20px;
        }
    </style>