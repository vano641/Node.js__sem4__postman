const express = require('express');

const app = express();

const users = [];

let uniqueId = 0;


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