import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axiosWithAuth from '../axios';

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticle, setCurrentArticle] = useState(null)
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token');
        setMessage('Goodbye!');
        redirectToLogin()
      } else {
        redirectToLogin()
      }
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    axiosWithAuth().post(loginUrl, {
        username: username,
        password: password,
    })

    .then(response => {
      localStorage.setItem('token', response.data.token)
      setMessage(response.data.message)
      redirectToArticles()

    })

    .catch(err => {
      console.log(err.message)
    })
    
    .finally(() => {
      setSpinnerOn(false)
    })


    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    const token = localStorage.getItem('token');

    setMessage('');
    setSpinnerOn(true);

    axiosWithAuth().get(articlesUrl, articles, {
      headers: {
        authorization: token
      },
    })
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
        setMessage(err.message)
        redirectToLogin()
      })
      .finally(() => {
        setSpinnerOn(false);
      })

    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    const token = localStorage.getItem('token');

    setMessage('');
    setSpinnerOn(true);

    axiosWithAuth().post(articlesUrl, article, {
      headers: {
        authorization: token,
      }
    })
      .then(res => {
        console.log(res)
        setArticles(prevArticles => 
          [...prevArticles, res.data.article])
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err.message)
        setMessage(err.message)
        redirectToLogin()
      })
      .finally(setSpinnerOn(false))
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    const token = localStorage.getItem('token');
    
    setMessage('');
    setSpinnerOn(true);

    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      setArticles(prevArticles => 
        prevArticles.map(prevArticle => 
          prevArticle.article_id === res.data.article_id ? res.data.article : prevArticle
        )
      );
      setMessage(res.data.message);
    })
    .catch(err => {
      setMessage(err.message)
      console.log(err.message)
    })
    .finally(
      setSpinnerOn(false)
    )
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    const token = localStorage.getItem('token');

    setMessage('');
    setSpinnerOn(true);

    axiosWithAuth().delete(`${articlesUrl}/${article_id}`, {
      headers: {
        authorization: token
      },
    })
    .then(res => {
      setMessage(res.data.message)

    })
    .catch((err) => {
      console.log(err.message)
    })
    .finally(
      setSpinnerOn(false)
      
    )
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 

                postArticle={postArticle} 
                updateArticle={updateArticle}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={currentArticle}
              />
              <Articles 
                articles={articles}
                getArticles={getArticles} 
                deleteArticle={deleteArticle}
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                setCurrentArticle={setCurrentArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
