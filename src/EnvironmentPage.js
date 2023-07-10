import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { withAuthenticationRequired } from "@auth0/auth0-react"
import { useQuery } from 'react-query'
import axios from 'axios'
import useStore from './Store'

import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'


import { RiArrowGoBackFill } from "react-icons/ri"
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import UserCollection from './Okta/userCollection'
import GroupsCollection from './Okta/groupsCollection'


const EnvironmentPage = () => {
  const environments = useStore(state => state.environments)
  const history = useHistory()
  //the store cannot be empty and the component must be invoked from the / route
  if(!environments.length) history.push('/')

  //Get pointer to current environment
  const {id} = useParams()
  const currentEnvironment = environments.find(item => item.name === id)


  const [orgAdminUI, setOrgAdminUI] = useState(currentEnvironment.issuer)

  useEffect(() => {
    async function fetchData() {
  
        let parts = []
        try {
          const response = await axios.get(`https://${currentEnvironment.issuer}/.well-known/okta-organization`)
      
          if (response.status === 200) {
            const config = response.data
            //console.info(config)
            let orgUrl = new URL(config._links.organization.href)
            parts = orgUrl.hostname.split('.')
            parts[0] += "-admin"
            setOrgAdminUI(parts.join('.'))
          }
          else 
            throw new Error(`Failed to retrieve {id} configuration. Status: ${response.status}`)      
        } 
        catch (error) {
            console.error('There has been a problem getting organization configuration:', error);
        }
    }
    fetchData()
  }, [currentEnvironment])


  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)

  const fetchAccessToken = async () => {

    const widgetConfig = {
      language: 'en',
      i18n: {
        // Overriding English properties
        'en': {
          'primaryauth.title': 'Sign in to ' + currentEnvironment.name,
        },
      },

      baseUrl: 'https://' + currentEnvironment.issuer,
      issuer: 'https://' + currentEnvironment.issuer,
      clientId: currentEnvironment.clientid,
      redirectUri: window.location.origin + '/environment/callback',
      authParams: {
        pkce: true,
        responseType: ['token'],
        scopes: [
          'okta.users.read', 'okta.users.read.self', 'okta.groups.read',
          'okta.appGrants.read', 'okta.apps.read', 
          'okta.authenticators.read', 
          'okta.authorizationServers.read',
          'okta.clients.read', 
          'okta.factors.read', 
          //'okta.brands.read', 
          //'okta.captchas.read', 'okta.certificateAuthorities.read', 
          //'okta.deviceAssurance.read', 'okta.devices.read', 
          //'okta.domains.read', 'okta.emailDomains.read', 
          //'okta.inlineHooks.read', 
          //'okta.eventHooks.read', 
          //'okta.events.read',
          //'okta.features.read', 
          'okta.linkedObjects.read', 
          'okta.myAccount.email.read', 'okta.myAccount.phone.read', 'okta.myAccount.profile.read', 
          'okta.networkZones.read',
          'okta.policies.read', 
          'okta.profileMappings.read',
          'okta.roles.read', 
          'okta.schemas.read',
          'okta.sessions.read',
          //'okta.templates.read', 'okta.threatInsights.read', 'okta.trustedOrigins.read', 
          //'okta.uischemas.read', 'okta.userTypes.read', 'okta.reports.read', 'okta.logs.read', 
          //'okta.idps.read', 
          //'okta.riskProviders.read', 
          //'okta.oauthIntegrations.read', 
          //'okta.logStreams.read', 
          //'okta.governance.accessCertifications.read', 
          //'okta.rateLimits.read', 
          //'okta.principalRateLimits.read', 
        ]
      }
    }

    const widget = new OktaSignIn(widgetConfig)
  
    return new Promise((resolve, reject) => {
      //CHF : some states may be used/changed here to make sure nothing is displayed while authn is undergoing
      setIsWidgetLoaded(true)

      widget.renderEl({ el: '#widget-container' }, (res) => {

        if (res.status === 'SUCCESS') {
          //console.info({Token : res.tokens.accessToken})
          //console.info(res.tokens.accessToken.scopes.includes('okta.users.read'))
          resolve(res.tokens.accessToken)
          widget.remove()
          setIsWidgetLoaded(false)
        }
      }, 
      (err) => {
        reject(err)
      })
    })
  }

  const handleBackToEnvironments = () => {
    history.push('/')
  }

  const mykey = currentEnvironment.issuer + '.token'
  //const { data: token, isLoading, isError, error } = useQuery(mykey, fetchAccessToken, {
  const { data: token, isError, error } = useQuery(mykey, fetchAccessToken, {
    staleTime: 1000 * 60 * 60,        // 60 minutes - consider this with the actual expiration of the token (1h)
    cacheTime: 1000 * 60 * 60 ,       // sensible amount considering your use case
    retry: 1                          // number of retry attempts when the fetch fails
  })


  const [currentChild, setCurrentChild] = useState('users')
  const [serverFilter, setServerFilter] = useState('')
  const [submitFilter, setSubmitFilter] = useState(false)

  useEffect(() => {
    if (submitFilter) {
      setSubmitFilter(false)
    }
  }, [submitFilter])

  useEffect(() => {
    setServerFilter('')
  }, [currentChild])

  const handleServerFilter = (e) => {
    e.preventDefault()

    // Now searchTerm can be used to search or can be passed to child
    setSubmitFilter(true)
  }

  return (
    <div className='container'>

      {!isWidgetLoaded &&
        <>
          {!token &&
            <>
              Environment {id}           
              <button type="button" className="btn btn-primary btn-sm" style={{marginRight: 1 + 'em', marginLeft: 1 + 'em'}} onClick={handleBackToEnvironments} >Back to environments</button>
            </>
          }

          {token &&
            <>
              <Navbar id='envBar'>
                <Container fluid>
                  <Navbar.Brand>Environment {id}</Navbar.Brand>
                  <Navbar.Toggle aria-controls="navbar-dark-example" />
                  <Navbar.Collapse id="navbar-dark-example">
                    <Nav className='me-auto' variant="underline">

                      <Nav.Link onClick={handleBackToEnvironments}><RiArrowGoBackFill/> Environments</Nav.Link>
                      <Nav.Link href ={`https://${orgAdminUI}`} target="_blank" rel="noopener noreferrer">Admin UI</Nav.Link>
                      <NavDropdown title="Areas ..." menuVariant="light">
                        <Dropdown.Header>Directory</Dropdown.Header>
                        <Dropdown.Item onClick={() => setCurrentChild('users')}>Users</Dropdown.Item>
                        <Dropdown.Item onClick={() => setCurrentChild('groups')}>Groups</Dropdown.Item>                      
                        <Dropdown.Item onClick={() => setCurrentChild('schemas')}>Schemas</Dropdown.Item>                      
                        <NavDropdown.Divider />
                        <Dropdown.Header>More ...</Dropdown.Header>
                        <NavDropdown.Item onClick={() => setCurrentChild('apps')}>Apps</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setCurrentChild('mfa')}>MFA</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setCurrentChild('authz')}>Authorization servers</NavDropdown.Item>
                      </NavDropdown>
                    </Nav>

                    {['users', 'groups'].includes(currentChild) &&
                      <Form className="d-flex" onSubmit={handleServerFilter}>
                        <Form.Control size="sm" type="search" placeholder="Server-side search" 
                          value={serverFilter} onChange={e => setServerFilter(e.target.value)} />
                        <Button variant="outline-primary" size='sm' type='submit'>Search</Button>
                      </Form>
                    }
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </>
          }
        </>
      }

      {isError && <div>An error occurred: {error.message}</div>}

      {!isWidgetLoaded && token && token.accessToken &&
        <div style={{marginTop: '.15rem'}}>
          {currentChild === 'users' && !submitFilter && <UserCollection data={ token } serverFilter={serverFilter}/>}
          {currentChild === 'groups' && <GroupsCollection data={ token } />}
        </div>
      }

      {isWidgetLoaded &&
        <div className='text-center' style={{marginTop: 1 + 'em'}}>
          <h5>Loading ...</h5>
          <button type="button" className="btn btn-primary btn-sm" style={{marginTop: 1 + 'em'}} onClick={handleBackToEnvironments} >Back to environments</button>
        </div>
      }
      <div id="widget-container"></div>
    </div>    
  )
}

export default withAuthenticationRequired(EnvironmentPage)