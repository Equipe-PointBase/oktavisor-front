import React, { useMemo, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import visorConfig from './config'
import useStore from './Store'
import axios from 'axios'

import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"

import LoginButton from './login-button'

import MaterialReactTable from 'material-react-table'
import { Box, IconButton } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon, Share as ShareIcon } from '@mui/icons-material'


function Home () {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const history = useHistory()

    //define state/store for environment data
    var environments = useStore(state => state.environments)
    const setEnvironments = useStore(state => state.setEnvironments)

    useEffect(() => {
        setEnvironments(user.environments); // initialize the array with pre-existing values once the user is authenticated (user.environments will change)
      }, [user.environments])

    if(!isAuthenticated) {
        return(
            <div className='container'>
                <h1>Welcome to Oktavisor  !</h1>
                <br/>
                <LoginButton/>
            </div>
        )
    }
    else {
        //Define states for environment form
        const newEnvironment = { clientid: '', issuer: '', name: '', useClassicEngine: false }
        const [formData, setFormData] = useState(newEnvironment)
        const [formTitle, setFormTitle] = useState('Add Environment')
        const [originalData, setOriginalData] = useState(newEnvironment)

        const handleChange = (event) => { 
            let myValue = (event.target.type === 'checkbox' ? event.target.checked : event.target.value)
            setFormData({ ...formData, [event.target.name]: myValue, })
        }

        const editEnvironment = (rowData) => { 
            //console.info(rowData)
            let myTitle = rowData ? 'Edit ' + rowData.name : 'Add environment'
            setFormTitle(myTitle)

            let myData = rowData ? rowData : newEnvironment
            setOriginalData(myData)
            setFormData(myData)
        }

        const confirmEditEnvironment = async () => {
            console.info(formData)

            let newItems = originalData.name ? environments.map(item => item.name === originalData.name ? formData : item) : [...environments, formData]
            setEnvironments(newItems)
            await saveEnvironments(newItems)
        }

        const removeEnvironment = (rowData) => { 
            setFormTitle('Remove ' + rowData.name)
            setFormData(rowData)
        }

        const confirmRemoveEnvironment = async () => {
            let newItems = environments.filter(i => i.name !== formData.name)
            setEnvironments(newItems)
            await saveEnvironments(newItems)
        }

        const saveEnvironments = async (envData) => {

            try {
                const token = await getAccessTokenSilently()
                const myUrl = `${visorConfig.backEnd.baseUrl}/update-environments`
                await axios(myUrl, { 
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${token}` },
                    data: envData
                })

            } catch (error) {
                console.error('There has been a problem saving environments:', error);
            }
        }

        const connectToEnvironment = (rowData) => {
            history.push(`/environment/${rowData.name}`)
        }

        //simple column definitions pointing to data
        const columns = useMemo(() => [
            {header: 'Name', accessorKey: 'name'},
            {header: 'Issuer',accessorKey: 'issuer'},
            {header: 'Client Id',accessorKey: 'clientid'},
            ],
            [],
        )

        return(
            <div className='container'>

                <div className="modal fade" id="modalEnvironment" tabIndex="-1" aria-labelledby="modalEnvironment" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{formTitle}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="col-form-label">Name:</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="issuer" className="col-form-label">Domain:</label>
                                        <input type="text" className="form-control" name="issuer" value={formData.issuer} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="clientid" className="col-form-label">ClientId:</label>
                                        <input type="text" className="form-control" name="clientid" value={formData.clientid} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="checkbox" className="form-check-input" name="useClassicEngine" checked={formData.useClassicEngine} onChange={handleChange} />
                                        <label htmlFor="useClassicEngine" className="col-form-label">Use classic engine</label>
                                    </div>
                                </form>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={confirmEditEnvironment} data-bs-dismiss="modal">Save changes</button>
                            </div>
                    </div>
                    </div>
                </div>

                <div className="modal fade" id="modalDeleteEnvironment" tabIndex="-1" aria-labelledby="modalDeleteEnvironment" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{formTitle}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>No regrets ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmRemoveEnvironment}>Remove</button>
                            </div>
                    </div>
                    </div>
                </div>

                <MaterialReactTable
                    columns={columns}
                    data={environments}
                    //enableRowSelection
                    enableMultiRowSelection={false}
                    enableColumnOrdering
                    enableGlobalFilter={false} //turn off a feature
                    enableFullScreenToggle={false}

                    enableRowActions
                    renderRowActions={({ row }) => (
                      <Box>
                        <IconButton color='primary' data-bs-toggle="modal" data-bs-target="#modalEnvironment" onClick={() => editEnvironment(row.original)}><EditIcon /></IconButton>
                        <IconButton color='primary'  onClick={() => connectToEnvironment(row.original)}><ShareIcon /></IconButton>
                        <IconButton color='error' data-bs-toggle="modal" data-bs-target="#modalDeleteEnvironment" onClick={() => removeEnvironment(row.original)}><DeleteIcon /></IconButton>
                      </Box>
                    )}
                    positionActionsColumn="last"

                    renderTopToolbarCustomActions={({ table }) => {
                        return (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <h5 className='mt-1' style={{marginLeft: '.5rem', marginRight: '1rem'}}>Environments</h5>
                                <button className='btn btn-sm btn-outline-primary' data-bs-toggle="modal" data-bs-target="#modalEnvironment" aria-label="add" onClick={() => editEnvironment()} > + Add </button>
                            </div>
                        );
                      }}
                />

                <div className="mt-3">
                    <p>
                        An <em>environment</em> represents an actual Okta tenant.
                        <br/>
                        To make the target Okta tenant work as an Oktavisor environment, you need to set up a new application in the Okta tenant.
                    </p>
                </div>

            </div>
        )
    }
}

export default withAuthenticationRequired(Home)