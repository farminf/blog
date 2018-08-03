import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Media from 'react-media'


import Header from '../components/header'
import Sidebar from '../components/sidebar'
import './index.css'
import "../styles/layout-overide.css";


const Layout = ({ children, data }) => (
  <div>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: 'Farmin Blog Site' },
        { name: 'keywords', content: 'farmin, blog' },
      ]}
    />
    <Header siteTitle={data.site.siteMetadata.title} />
    <div
      style={{
        margin: "0 auto",
        maxWidth: 1080,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: "100%"
      }}
    >
    <Media query={{ maxWidth: 848 }}>
    {matches =>
      matches ? (
        <div
          style={{
            margin: "0 auto",
            maxWidth: 1080,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "100%",
            padding: "25px"
          }}
        >
          <div style={{ flex: 1 }}>{children()}</div>
        </div>
      ) : (
        <div
          style={{
            margin: "0 auto",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "100%",
            padding: "0px"
          }}
        >
          <div style={{ flex: 3.5, paddingRight: "30px" }}>
            {children()}
          </div>
          <div style={{ flex: "1.4 1 0%" }}>
                <Sidebar
                  title="Spare Time Adventures"
                  description="is my personal blog about the personal projects that I do in my free time"
                />
                <Sidebar
                  title="My name is Farmin"
                  description="and I am a Full-stack Developer. I love IoT, Cloud Services and React."
                />
                <Sidebar
                  title="My old blog website"
                  description="was on Wordpress from 2016, I decided to use Gatsby and github pages for my new blog and I'm super satisfied!"
                  link="https://iotdemos.wordpress.com/"
                />
              </div>
            </div>
          )
        }
      </Media>
    </div>
  </div>
)

Layout.propTypes = {
  children: PropTypes.func,
}

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
