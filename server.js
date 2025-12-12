const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const movies = [
  {
    id: 1,
    name: 'Властелин колец: Братство кольца',
    description: 'Эпическое фэнтези о хоббите Фродо, который должен уничтожить Кольцо Всевластия в огне Роковой горы',
    price: 1500,
    image: 'https://ik.imagekit.io/faiflswaf/hocmarketing-org/08/27/og-43731-the-ultimate-guide-to-reading-tolkiens-books-unveiling-the-perfect-order-for-lotr-fans?tr=w-600,h-400',
    category: 'fantasy',
    actors: ['Элайджа Вуд', 'Иэн Маккеллен', 'Вигго Мортенсен', 'Орландо Блум'],
    rating: 4.9
  },
  {
    id: 2,
    name: 'Начало',
    description: 'Криминальный триллер о ворах, которые внедряются в сны людей чтобы украсть их идеи',
    price: 1200,
    image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/articles/17071995-859972.jpg',
    category: 'sci-fi',
    actors: ['Леонардо ДиКаприо', 'Марион Котийяр', 'Том Харди', 'Эллен Пейдж'],
    rating: 4.8
  },
  {
    id: 3,
    name: 'Крестный отец',
    description: 'Эпическая сага о семье мафиози Корлеоне и их борьбе за власть в преступном мире',
    price: 1100,
    image: 'https://avatars.mds.yandex.net/i?id=ba97b4d8b95aa5e07775db3f1b73a3f5_l-7054477-images-thumbs&n=13',
    category: 'drama',
    actors: ['Марлон Брандо', 'Аль Пачино', 'Джеймс Каан', 'Роберт Дюваль'],
    rating: 4.9
  },
  {
    id: 4,
    name: 'Темный рыцарь',
    description: 'Бэтмен сталкивается с главным испытанием в лице Джокера - анархиста, сеющего хаос в Готэме',
    price: 1300,
    image: 'https://www.indiewire.com/wp-content/uploads/2018/10/the-dark-knight-christian-bale.jpg?w=600&h=400&crop=1',
    category: 'action',
    actors: ['Кристиан Бейл', 'Хит Леджер', 'Аарон Экхарт', 'Мэгги Джилленхол'],
    rating: 4.9
  },
  {
    id: 5,
    name: 'Побег из Шоушенка',
    description: 'История невиновного банкира, приговоренного к пожизненному заключению, и его пути к свободе',
    price: 1000,
    image: 'https://tv.pgtrk.com/sites/default/files/show/2017/12/esaretin-bedeli-turkce-dublaj-full-hd-izle-521.jpg',
    category: 'drama',
    actors: ['Тим Роббинс', 'Морган Фриман', 'Боб Гантон', 'Джеймс Уитмор'],
    rating: 4.9
  },
  {
    id: 6,
    name: 'Форрест Гамп',
    description: 'История простого человека с добрым сердцем, который невольно становится свидетелем ключевых событий американской истории',
    price: 1050,
    image: 'https://avatars.mds.yandex.net/i?id=66e4b75da6f5a9d0cfc80d278a91e40f_l-5222073-images-thumbs&n=13',
    category: 'drama',
    actors: ['Том Хэнкс', 'Робин Райт', 'Гэри Синиз', 'Салли Филд'],
    rating: 4.8
  },
  {
    id: 7,
    name: 'Матрица',
    description: 'Хакер Нео узнает, что его мир - это симуляция, и присоединяется к восстанию против машин',
    price: 1250,
    image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/articles/44271663-1089252.jpg',
    category: 'sci-fi',
    actors: ['Киану Ривз', 'Лоренс Фишберн', 'Керри-Энн Мосс', 'Хьюго Уивинг'],
    rating: 4.7
  },
  {
    id: 8,
    name: 'Криминальное чтиво',
    description: 'Переплетающиеся истории лос-анджелесских бандитов, наемных убийц и их приятелей',
    price: 1150,
    image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/articles/42948379-1077495.jpg',
    category: 'action',
    actors: ['Джон Траволта', 'Сэмюэл Л. Джексон', 'Ума Турман', 'Брюс Уиллис'],
    rating: 4.8
  },
  {
    id: 9,
    name: 'Зеленая миля',
    description: 'Надзиратель тюрьмы узнает, что один из заключенных обладает сверхъестественными способностями',
    price: 1100,
    image: 'https://avatars.mds.yandex.net/i?id=8661ae9bd15d37092b0150e584f5e11a_l-4055677-images-thumbs&n=13',
    category: 'drama',
    actors: ['Том Хэнкс', 'Майкл Кларк Дункан', 'Дэвид Морс', 'Бонни Хант'],
    rating: 4.8
  },
  {
    id: 10,
    name: 'Интерстеллар',
    description: 'Группа исследователей путешествует через червоточину в космосе в поисках нового дома для человечества',
    price: 1400,
    image: 'https://www.film.ru/sites/default/files/styles/epsa_600x400/public/articles/49632226-1376988.jpg',
    category: 'sci-fi',
    actors: ['Мэттью Макконахи', 'Энн Хэтэуэй', 'Джессика Честейн', 'Майкл Кейн'],
    rating: 4.7
  },
  {
    id: 11,
    name: 'Однажды в Голливуде',
    description: 'История актера и его дублера, пытающихся найти свое место в быстро меняющемся Голливуде 1969 года',
    price: 1200,
    image: 'https://avatars.mds.yandex.net/i?id=64888715a05533f1102400e8a25653d6_l-3829399-images-thumbs&n=13',
    category: 'comedy',
    actors: ['Леонардо ДиКаприо', 'Брэд Питт', 'Марго Робби', 'Аль Пачино'],
    rating: 4.6
  },
  {
    id: 12,
    name: 'Оно',
    description: 'Группа детей сталкивается со злобным существом, принимающим облик их самых страшных кошмаров',
    price: 1300,
    image: 'https://u.livelib.ru/reader/Navigator/r/gmk3ymch/gmk3ymch-r.jpg',
    category: 'horror',
    actors: ['Билл Скарсгард', 'Джэйден Мартел', 'София Лиллис', 'Финн Вулфхард'],
    rating: 4.5
  },
  {
    id: 13,
    name: 'Запах женщины',
    description: 'Молодой студент нанимается ухаживать за слепым, циничным отставным подполковником',
    price: 950,
    image: 'https://www.film.ru/sites/default/files/styles/thumb_600x400/public/filefield_paths/zapah-zhenshhiny_004.jpg',
    category: 'drama',
    actors: ['Аль Пачино', 'Крис О\'Доннелл', 'Джеймс Ребхорн', 'Габриэль Анвар'],
    rating: 4.7
  },
  {
    id: 14,
    name: 'Джентльмены',
    description: 'Американский наркобарон пытается продать свою прибыльную империю сети богатых олигархов',
    price: 1250,
    image: 'https://avatars.mds.yandex.net/i?id=a034b1d0c71ab7573bd0b47f41fc8089aae315b8-4034271-images-thumbs&n=13',
    category: 'action',
    actors: ['Мэттью Макконахи', 'Чарли Ханнэм', 'Хью Грант', 'Мишель Докери'],
    rating: 4.6
  },
  {
    id: 15,
    name: 'Ла-Ла Ленд',
    description: 'История любви джазового музыканта и начинающей актрисы, пытающихся найти себя в Лос-Анджелесе',
    price: 1100,
    image: 'https://avatars.mds.yandex.net/i?id=2cefd9c986828e447c7113170288e513_l-7698965-images-thumbs&n=13',
    category: 'romance',
    actors: ['Райан Гослинг', 'Эмма Стоун', 'Джон Ледженд', 'Розмари ДеУитт'],
    rating: 4.7
  },
  {
  id: 16,
  name: 'Дюна: Часть вторая',
  description: 'Продолжение эпической саги о Пол Атрейдесе, который объединяется с фрименами Арракиса в борьбе против Империи',
  price: 1200,
  image: 'https://avatars.mds.yandex.net/i?id=6fa9a89b111ff28b57e5b38093afc5ad_l-10280838-images-thumbs&n=13',
  category: 'sci-fi',
  actors: ['Тимоти Шаламе', 'Зендея', 'Ребекка Фергюсон', 'Оскар Айзек'],
  rating: 4.9
},
{
  id: 17,
  name: 'Оппенгеймер',
  description: 'Биографический триллер о жизни физика Роберта Оппенгеймера и его роли в создании атомной бомбы',
  price: 1150,
  image: 'https://avatars.mds.yandex.net/i?id=7ff2078c71f124a12ba9ae4a0c386359_l-9138088-images-thumbs&n=13',
  category: 'biography',
  actors: ['Киллиан Мерфи', 'Эмили Блант', 'Мэтт Дэймон', 'Роберт Дауни мл.'],
  rating: 4.8
},
{
  id: 18,
  name: 'Джон Уик 4',
  description: 'Легендарный киллер Джон Уик сражается против могущественного клана, чтобы обрести свободу',
  price: 1050,
  image: 'https://avatars.mds.yandex.net/i?id=6902d1505a80e12ea09b8bc9e9d5f9ac_l-8827467-images-thumbs&n=13',
  category: 'action',
  actors: ['Киану Ривз', 'Донни Йен', 'Билл Скарсгард', 'Лоренс Фишберн'],
  rating: 4.6
},
{
  id: 19,
  name: 'Бедняги',
  description: 'Экранизация мюзикла о жизни обитателей парижских трущоб в XIX веке и их борьбе за достоинство и свободу',
  price: 950,
  image: 'https://avatars.mds.yandex.net/i?id=baec0c3d9963263ffdb091a66b384e55_l-5223992-images-thumbs&n=13',
  category: 'musical',
  actors: ['Хью Джекман', 'Рассел Кроу', 'Энн Хэтэуэй', 'Аманда Сайфред'],
  rating: 4.5
},
];


const categories = [
  { id: 'all', name: 'Все фильмы' },
  { id: 'action', name: 'Боевики' },
  { id: 'comedy', name: 'Комедии' },
  { id: 'drama', name: 'Драмы' },
  { id: 'fantasy', name: 'Фэнтези' },
  { id: 'horror', name: 'Ужасы' },
  { id: 'sci-fi', name: 'Фантастика' },
  { id: 'romance', name: 'Мелодрамы' }
];


app.get('/api/movies', (req, res) => {
  const { q, category } = req.query;
  let filteredMovies = [...movies];


  if (q) {
    const query = q.toLowerCase();
    filteredMovies = filteredMovies.filter(movie =>
      movie.name.toLowerCase().includes(query) ||
      movie.description.toLowerCase().includes(query) ||
      movie.category.toLowerCase().includes(query) ||
      movie.actors.some(actor => actor.toLowerCase().includes(query))
    );
  }

  if (category && category !== 'all') {
    filteredMovies = filteredMovies.filter(movie => 
      movie.category === category
    );
  }

  res.json({
    success: true,
    data: filteredMovies,
    total: filteredMovies.length
  });
});

app.get('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      error: 'Movie not found'
    });
  }

  res.json({
    success: true,
    data: movie
  });
});

app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

app.post('/api/movies', (req, res) => {
  const { name, description, price, image, category, actors, rating } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      success: false,
      error: 'Name and price are required'
    });
  }

  const newMovie = {
    id: movies.length > 0 ? Math.max(...movies.map(m => m.id)) + 1 : 1,
    name,
    description: description || '',
    price: parseFloat(price),
    image: image || getDefaultImage(category),
    category: category || 'action',
    actors: actors || [],
    rating: rating || 4.0
  };

  movies.push(newMovie);

  res.status(201).json({
    success: true,
    data: newMovie,
    message: 'Movie added successfully'
  });
});

app.put('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Movie not found'
    });
  }

  const updatedMovie = {
    ...movies[movieIndex],
    ...req.body,
    id 
  };

  movies[movieIndex] = updatedMovie;

  res.json({
    success: true,
    data: updatedMovie,
    message: 'Movie updated successfully'
  });
});


app.delete('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movieIndex = movies.findIndex(m => m.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Movie not found'
    });
  }

  const deletedMovie = movies.splice(movieIndex, 1)[0];

  res.json({
    success: true,
    data: deletedMovie,
    message: 'Movie deleted successfully'
  });
});


function getDefaultImage(category) {
  const defaultImages = {
    action: 'https://images.unsplash.com/photo-1489599809505-7c8e1c869cc2?w=300&h=450&fit=crop',
    comedy: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop',
    drama: 'https://images.unsplash.com/photo-1489599809505-7c8e1c869cc2?w=300&h=450&fit=crop',
    fantasy: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    horror: 'https://images.unsplash.com/photo-1509248961154-411f6c4d36c9?w=300&h=450&fit=crop',
    'sci-fi': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop',
    romance: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
    thriller: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop',
    animation: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=450&fit=crop'
  };
  return defaultImages[category] || defaultImages['action'];
}


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});


app.listen(PORT, () => {
  console.log(`🎬 EYE MOVIE API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});