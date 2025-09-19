// Задание №6 (тайминг 10 минут)
// - Установить Joi с помощью NPM (npm i joi)
// - Определить схему валидации запроса на создание пользователя(пока не применять в
// обработчиках)
// - firstName и secondName - это строки, которые должны иметь не менее одного
// символа. Также эти поля обязательны для создания.
// - age - это обязательное число, которое не может быть меньше 0 и более 150
// - city - это необязательная строка с минимальным количеством символов 1

const express = require('express');
const joi = require('joi');


const app = express();

const users = [];
let uniqueId = 0;

// "проверка(валидация) данных по описанным параметрам"
const userSchema = joi.object({
    // цепочка методов описывающие параметры
    // тип строка, мин.длинна 1 символ, обязательное поле
    firstName: joi.string().min(1).required(),
    secondName: joi.string().min(1).required(),
    age: joi.number().min(0).max(150).required(),
    city: joi.string().min(1)
})

app.use(express.json())

// получаем пользователей
app.get('/users', (req, res) => {
    res.send({users});
})

// получаем пользователя по id
app.get('/users/:id', (req, res) => {
    const userId = +req.params.id; // или можно записать так +req.params.id приводим к number
    const user = users.find((user) => user.id === userId);
    if (user) {
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
    res.send({users});
})

// создаем пользователя
app.post('/users', (req, res) => {
    console.log(req.body);
    uniqueId += 1;
    users.push({
        id: uniqueId,
        ...req.body
    })
    res.send({id: uniqueId});
})

// обновляем пользователя
app.put('/users/:id', (req, res) => {
    // результат валидации
    const result = userSchema.validate(req.body);
    // проверка (в Postman если в методе Обновления данных передать "Пустую строку
    // в поле userName, то вывалится ошибка Не соответствия переданных данных параметрам валидации")
    if (result.error) {
        return res.status(404).send({error: result.error.details});
    }

    const userId = Number(req.params.id); // или можно записать так +req.params.id приводим к number
    const user = users.find((user) => user.id === userId);
    if (user) {
        const {firstName, secondName, age, city} = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.age = age;
        user.city = city;

        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
})

// удаляем пользователя
app.delete('/users/:id', (req, res) => {
    const userId = Number(req.params.id); // или можно записать так +req.params.id приводим к number
    
    const user = users.find((user) => user.id === userId);
    if (user) {
        const userIndex = users.indexOf(user); // ищем индекс юзера
        users.splice(userIndex, 1); // с этого индекса удали 1 элемент
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
})

app.listen(3000);