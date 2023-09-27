const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '43264335Exe',
  database: 'MySpaceKids',
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to MySQL database');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/register', async (req, res) => {
  const { email, usuario, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (usuario, email, contrasena) VALUES (?, ?, ?)`;
  const values = [usuario, email, hashedPassword];

  try {
    // Verificar si el usuario o el correo electrónico ya existen en la base de datos
    const checkSql = `SELECT * FROM users WHERE usuario = ? OR email = ?`;
    const checkValues = [usuario, email];
    const [rows] = await connection.promise().query(checkSql, checkValues);
    if (rows.length > 0) {
     
      if (rows[0].usuario === usuario) {
        return res.status(400).json({ message: 'El usuario ya está registrado' });
      }else if (rows[0].email === email) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }
    }

    // Proceder con el registro del nuevo usuario
    const result = await connection.promise().query(sql, values);
    const userId = result[0].insertId;

    // Establecer la imagen de fondo predeterminada en user_settings
    const defaultBackgroundImage = '/src/assets/Theme1.png';
    const profileImage = 'src/assets/userimg.png';
    const setUserSettingsSql = `INSERT INTO users_settings (user_id, background_theme, profile_img) VALUES (?, ?, ?)`;
    const setUserSettingsValues = [userId, defaultBackgroundImage, profileImage];
    await connection.promise().query(setUserSettingsSql, setUserSettingsValues);

    const insertMateriaSql = `INSERT INTO materias (user_id, nombre) VALUES (?, ?)`;
    const defaultMateriaName = 'Materia default';
    const insertMateriaValues = [userId, defaultMateriaName];
    await connection.promise().query(insertMateriaSql, insertMateriaValues);
    
    console.log('Usuario registrado exitosamente');
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
  } catch (error) {
    console.error('Error al registrar al usuario:', error);
    res.status(500).json({ message: 'Error al registrar al usuario' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;
  const values = [email];

  try {
    const [rows] = await connection.promise().query(sql, values);
    
    if (rows.length === 0) {
      res.status(401).json({ message: 'Credenciales inválidas' });
    } else {
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.contrasena);
    
      if (isPasswordValid) {
        res.status(200).json({
          message: 'Inicio de sesión exitoso',
          userId: user.id,
        });
      } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
      }
    }
  } catch (error) {
    console.error('Error al buscar al usuario:', error);
    res.status(500).json({ message: 'Error al buscar al usuario' });
  }
});

// Configuración de Nodemailer (usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'dragonofkills@gmail.com',
      pass: 'fiairtnxjxurpyfq'
    }
  });
  
  // Ruta para enviar el correo electrónico
  app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log('Received data from the client:');
    console.log(req.body);
    const mailOptions = {
      from: email,
      to: 'bobrukfs@gmail.com',
      subject: subject,
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
      } else {
        console.log('Correo enviado:', info.response);
        res.status(200).send('Correo enviado exitosamente');
      }
    });
  });
  
//Save materias

app.post('/save-materias', async (req, res) => {
  const { userId, userMaterias } = req.body;

  try {
    for (const materia of userMaterias) {
      const { id, nombre} = materia;

      // Verificar si la materia ya existe en la base de datos
      const existingMateria = await connection.promise().query(
        'SELECT * FROM materias WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (existingMateria[0].length > 0) {
        // La carta ya existe, realizar una actualización
        await connection.promise().query(
          'UPDATE materias SET nombre = ? WHERE id = ? AND user_id = ?',
          [nombre, id, userId]
        );
      } else {
        // La carta no existe, realizar una inserción
        await connection.promise().query(
          'INSERT INTO materias (user_id, nombre) VALUES (?, ?)',
          [userId, nombre,]
        );
      }
    }

    console.log('Materias guardadas exitosamente');
    res.status(201).json({ message: 'Materias guardadas exitosamente' });
  } catch (error) {
    console.error('Error al guardar las Materias:', error);
    res.status(500).json({ message: 'Error al guardar las Materias' });
  }
});


app.get('/get-materias', async (req, res) => {
  const userId = req.query.userId;
  console.log(userId);
  try {
    const sql = `SELECT nombre, id FROM materias WHERE user_id = ?`;
    const values = [userId];
    const result = await connection.promise().query(sql, values);

    res.status(200).json({ materia: result[0] });
  } catch (error) {
    console.error('Error al obtener las materias:', error);
    res.status(500).json({ message: 'Error al obtener las materias' });
  }
});



//Save cards
app.post('/save-cards', async (req, res) => {
  const { userId, userCards, idMateria } = req.body;
  console.log(req.body);
  try {
    for (const card of userCards) {
   
      const {uuid, titulo, respuesta, } = card;
  
      // Verificar si la tarjeta ya existe en la base de datos
      const existingCard = await connection.promise().query(
        'SELECT * FROM tarjetas WHERE uuid = ? AND materia_id = ?',
        [uuid, idMateria ]
      );

      if (existingCard[0].length > 0) {
        // La tarjeta ya existe, realizar una actualización
        await connection.promise().query(
          'UPDATE tarjetas SET titulo = ?, respuesta = ? WHERE uuid = ? ',
          [titulo, respuesta, uuid]
        );
      } else {
        // La tarjeta no existe, realizar una inserción
        console.log(uuid);
        await connection.promise().query(
          'INSERT INTO tarjetas (uuid, titulo, respuesta, materia_id) VALUES (?, ?, ?, ?)',
          [uuid, titulo, respuesta, idMateria ]
        );
      }
    }

    console.log('Tarjetas guardadas exitosamente');
    res.status(201).json({ message: 'Tarjetas guardadas exitosamente' });
  } catch (error) {
    console.error('Error al guardar las tarjetas:', error);
    res.status(500).json({ message: 'Error al guardar las tarjetas' });
  }
});

app.get('/get-cards', async (req, res) => {
  const idMateria = req.query.idMateria;


  try {
    const sql = `SELECT uuid, titulo, respuesta FROM tarjetas WHERE materia_id = ?`;
    const values = [idMateria];
    const result = await connection.promise().query(sql, values);
    res.status(200).json({ cards: result[0] });
  } catch (error) {
    console.error('Error al obtener las tarjetas:', error);
    res.status(500).json({ message: 'Error al obtener las tarjetas' });
  }
});

app.delete('/delete-card/:cardId', async (req, res) => {
  const cardId = req.params.cardId;
  console.log(cardId);
  try {
    const deleteSql = `DELETE FROM tarjetas WHERE uuid = ?`;
    const deleteValues = [cardId];

    await connection.promise().query(deleteSql, deleteValues);

    console.log(`Tarjeta con ID ${cardId} eliminada exitosamente`);
    res.status(200).json({ message: 'Tarjeta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar la tarjeta:', error);
    res.status(500).json({ message: 'Error al eliminar la tarjeta' });
  }
});

app.put('/update-card/:cardId', async (req, res) => {
  const cardId = req.params.cardId;
  const {id, titulo, respuesta } = req.body;
 
  try {
    const updateSql = `UPDATE tarjetas SET titulo = ?, respuesta = ? WHERE uuid = ?`;
    const updateValues = [titulo, respuesta, cardId];

    await connection.promise().query(updateSql, updateValues);

    console.log(`Tarjeta con ID ${cardId} actualizada exitosamente`);
    res.status(200).json({ message: 'Tarjeta actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la tarjeta:', error);
    res.status(500).json({ message: 'Error al actualizar la tarjeta' });
  }
});

    
//Save Tareas

app.post('/save-task', async (req, res) => {
  const { userId, userTareas } = req.body;

  try {
    for (const tarea1 of userTareas) {
      const { id, tarea} = tarea1;

      // Verificar si la carta ya existe en la base de datos
      const existingTarea = await connection.promise().query(
        'SELECT * FROM task WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (existingTarea[0].length > 0) {
        // La carta ya existe, realizar una actualización
        await connection.promise().query(
          'UPDATE task SET tarea = ? WHERE id = ? AND user_id = ?',
          [tarea, id, userId]
        );
      } else {
        // La carta no existe, realizar una inserción
        await connection.promise().query(
          'INSERT INTO task (user_id, tarea) VALUES (?, ?)',
          [userId, tarea,]
        );
      }
    }

    console.log('Tareas guardadas exitosamente');
    res.status(201).json({ message: 'Tareas guardadas exitosamente' });
  } catch (error) {
    console.error('Error al guardar las Tareas:', error);
    res.status(500).json({ message: 'Error al guardar las Tareas' });
  }
});

app.delete('/delete-task/:idTarea', async (req, res) => {
  const { idTarea } = req.params;
  const userId = req.body.userId;

  try {
    const result = await connection.promise().query(
      'DELETE FROM task WHERE id = ? AND user_id = ?',
      [idTarea, userId]
    );

    if (result[0].affectedRows > 0) {
      console.log('Tarea eliminada exitosamente');
      res.status(204).end(); // Respuesta exitosa sin contenido
    } else {
      console.log('No se encontró la tarea para eliminar');
      res.status(404).json({ message: 'No se encontró la tarea para eliminar' });
    }
  } catch (error) {
    console.error('Error al eliminar la tarea:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
});


app.get('/get-tasks', async (req, res) => {
  const userId = req.query.userId;
  console.log(userId);
  try {
    const sql = `SELECT tarea, id FROM task WHERE user_id = ?`;
    const values = [userId];
    const result = await connection.promise().query(sql, values);

    res.status(200).json({ tarea: result[0]});
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
}); 

app.put('/update-task/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { newContent } = req.body; 
  console.log(taskId);

  try {
    const updateSql = `UPDATE task SET tarea = ? WHERE id = ?`; // 
    const updateValues = [newContent, taskId]; 

    await connection.promise().query(updateSql, updateValues);

    console.log(`Tarea con ID ${taskId} actualizada exitosamente`);
    res.status(200).json({ message: 'Tarea actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});

app.put('/update-user-background/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { background_theme } = req.body;
  

  try {
    const updateSql = `UPDATE users_settings SET background_theme = ? WHERE user_id = ?`;
    const updateValues = [background_theme, userId];
    
    await connection.promise().query(updateSql, updateValues);

    console.log(`Fondo de usuario con ID ${userId} actualizado exitosamente`);
    res.status(200).json({ message: 'Fondo de usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el fondo de usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el fondo de usuario' });
  }
});

app.get('/get-user-background/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const sql = `SELECT background_theme FROM users_settings WHERE user_id = ?`;
    const values = [userId];
    const result = await connection.promise().query(sql, values);

    if (result[0].length === 0 || !result[0][0].background_theme) {
      // Si el fondo no existe o es null/vacío, proporciona la URL del fondo predeterminado
      const defaultBackgroundImageUrl = '/src/assets/Theme1.png'; // Cambia esta URL por la URL real del fondo predeterminado
      res.status(200).json({ background_theme: defaultBackgroundImageUrl });
    } else {
      const backgroundImageUrl = result[0][0].background_theme;
      res.status(200).json({ background_theme: backgroundImageUrl });
    }
  } catch (error) {
    console.error('Error al obtener el fondo de usuario:', error);
    res.status(500).json({ message: 'Error al obtener el fondo de usuario' });
  }
});

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  