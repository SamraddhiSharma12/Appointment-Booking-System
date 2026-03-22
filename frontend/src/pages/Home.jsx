import React from 'react'
import Header from '../components/header'
import Speciality from '../components/speciality'
import TopDoctors from '../components/topdoctors'
import Banner from '../components/banner'
const Home = () => {
  return (
    <div>
      <Header/>
      <Speciality/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home