const router = require('express').Router();
const axios = require('axios');
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');
const quizData = require('../seeds/quizData')

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });


    let projects = [{id: 1, title: 'Project 1'}, {id: 2, title: 'Project 2'}];

    // Serialize data so the template can read it
   // projects = projectData.map((project) => project.get({ plain: true }));

    console.log('projects', projects);

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }

  try {
    // Make an HTTP GET request to fetch data
    const response = await axios.get('https://waifu.it/api/v4/facts');
    
    // Extract the data from the response
    const data = response.data;
    
    // Render the view with the fetched data
    return res.render('homepage', { data });
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching data:', error.message);
    
    // Check if the error is a 404 Not Found
    if (error.response && error.response.status === 404) {
        // Send a 404 response with an error message
        return res.status(404).send('Data not found');
    } else {
        // For other types of errors, send a generic error response
        return res.status(500).send('Internal Server Error');
    }
}
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/music-quiz', (req, res) => {
  res.render('music-quiz', { quizData });
});

module.exports = router;


// API for facts 

// {{!-- API Token NzE5MDM0ODI5MDkzNjAxMzUy.MTcxNTczMDQ5Ng--.0e8a1deef4 --}}

// {{!-- NzE5MDM0ODI5MDkzNjAxMzUy.MTcxNTczMDU5Mg--.fada2b62c98f --}}

// Authorization: NzE5MDM0ODI5MDkzNjAxMzUy.MTcxNTczMDU5Mg--.fada2b62c98f

// import axios from "axios"; 

// const axios = require("axios");

// const url = "https://waifu.it/api/v4/:endpoint"
// const data = async () => {
//     try {
//         const { data } = await axios.get(url, { headers: {
//             Authorization: "NzE5MDM0ODI5MDkzNjAxMzUy.MTcxNTczMDU5Mg--.fada2b62c98f",
//         } });
//         return data;
//     } catch (err) {
//         throw new Error(err.message);
//     }
// };

// console.log(data);



// API for quotes

// import axios from "axios";

// const axios = require("axios");

// const url = "https://waifu.it/api/v4/:quote"
// const data = async () => {
//     try {
//         const { data } = await axios.get(url, { headers: {
//             Authorization: "NzE5MDM0ODI5MDkzNjAxMzUy.MTcxNTczMDU5Mg--.fada2b62c98f",
//         } });
//         return data;
//     } catch (err) {
//         throw new Error(err.message);
//     }
// };

// console.log(data);

// const axios = require('axios');
// const url = "https://waifu.it/api/v4/:endpoint";

// const fetchData = async () => {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 Authorization: "NzE5MDM0ODI5MDkzNjAxMzUy.MTcxNTczMDU5Mg--.fada2b62c98f"
//             }
//         });
//         return response.data;
//     } catch (err) {
//         throw new Error(err.message);
//     }
// };

// // Call the function and log the result
// fetchData()
//     .then(data => console.log(data))
//     .catch(error => console.error(error));

// "status": 200,
// "message": {}

// "status": 404,
// "message": {}

// "status": 505,
// "message": {}

// console.log(data);