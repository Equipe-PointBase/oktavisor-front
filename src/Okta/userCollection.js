import React, { useMemo, useState, useEffect }  from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react"
import visorConfig from '../config'
import axios from 'axios'

import MaterialReactTable from 'material-react-table'
import { Box, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import UserDetails from './userDetails'

import UserMassDelete from './userMassDelete'


function UserCollection (data) {

    //console.info(data.data)
    const [currentToken, setCurrentToken] = useState(data.data)
    const [moreUrl, setMoreUrl] = useState('')
    const [myData, setMyData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const myUrl = visorConfig.backEnd.baseUrl + '/users'
                let result = await axios(myUrl, { 
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${currentToken.accessToken}`,
                        Domain: currentToken.claims.iss
                    },
                })
    
                setMyData(prevData => [...prevData, ...result.data])
                setIsLoading(false)
                setMoreUrl(result.headers['x-get-more'] ? result.headers['x-get-more'] : '')
            } 
            catch (error) {
                console.error('There has been a problem getting users data:', error);
            }
        }
        fetchData()
    }, [])

    async function handleGetMore(n) {
        setIsLoading(true)

        try {
            var i=0
            var myMoreUrl = moreUrl //Use this "local" var for it's updated real-time (not moreUrl which is a state)
            while(i === 0 || (i < n && myMoreUrl)) {

                const myUrl = visorConfig.backEnd.baseUrl + myMoreUrl
                console.log('myUrl = ' + myUrl)
                let result = await axios(myUrl, { 
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${currentToken.accessToken}`,
                        Domain: currentToken.claims.iss
                    },
                })
    
                setMyData(prevData => [...prevData, ...result.data])
                myMoreUrl = result.headers['x-get-more'] ? result.headers['x-get-more'] : ''
                setMoreUrl(myMoreUrl)

                i++
            }
        } 
        catch (error) {
            console.error('There has been a problem getting users data:', error)
        }

        setIsLoading(false)
    }

    //State for showing details
    const [showDetails, setShowDetails] = useState(false)
    function handleShowDetails(id) { 
        setSelectedId(id)
        setShowDetails(true) 
    }
    function handleCloseDetails() { 
        setShowDetails(false) 
    }

    //State for checked/selected objects
    const [selectedItems, setSelectedItems] = useState([])

    //State for mass-delete
    const [showDelete, setShowDelete] = useState(false)
    function handleCloseDelete() { 
        setShowDelete(false) 
    }

    function handleMassDelete() {
        //Get ids of items to delete to send them over to backend
        var itemsToDelete = selectedItems.map((row) => row.getValue('id'))

        

        //Reflect on the client 
        var res = myData.filter(obj => !itemsToDelete.includes(obj.id))
        setMyData(res)

        setShowDelete(false)
    }
    

  
    //Column definitions pointing to data
    const columns = useMemo(() => [
            {id: 'id', header: 'Id', accessorKey: 'id'},
            {   //accessorFn function that combines multiple data together
                accessorFn: (row) => `${row.profile.firstName} ${row.profile.lastName}`,
                id: 'name', header: 'Name',
            },
            {id: 'login', header: 'Login', accessorKey: 'profile.login', enableHiding: false},
            {id: 'email', header: 'Email', accessorKey: 'profile.email'},
            {id: 'status', header: 'Status', accessorKey: 'status'},
            {id: 'provider', header: 'Provider', accessorKey: 'credentials.provider.name'},
        ],
        [],
    )

    return(
        <div>
            <MaterialReactTable
                columns={columns}
                data={myData}
                state={{ showSkeletons: isLoading }}
                enableRowSelection
                enableMultiRowSelection={true}
                enableColumnOrdering
                enableGlobalFilter={true} 
                enableDensityToggle={true}
                enableFullScreenToggle={false}

                initialState={{
                    columnVisibility: { id: false },
                    density: 'compact',
                    showGlobalFilter: true,
                }}

                muiTableBodyRowProps={({ row }) => ({
                    backgroundcolor: row.status === 'PROVISIONED' ? 'orange' : 'white'
                })}

                enableRowActions
                renderRowActions={({ row }) => (
                  <Box>
                    <IconButton color='primary' onClick={() => handleShowDetails(row.original.id)}><SearchIcon /></IconButton>
                  </Box>
                )}
                positionActionsColumn="last"

                renderTopToolbarCustomActions={({ table }) => {
                    function handleAction(actionName) {
                        setSelectedItems(table.getSelectedRowModel().flatRows)
                        if(actionName === 'delete') setShowDelete(true)
                    }
            
                    return (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <h6 className='mt-2' style={{marginLeft: '.5rem', marginRight: '1rem'}}>Users</h6>
                            <button className='btn btn-sm btn-outline-primary' disabled={!table.getIsSomeRowsSelected()} onClick={() => handleAction('deactivate')} variant="contained">Deactivate</button>
                            <button className='btn btn-sm btn-outline-primary' disabled={!table.getIsSomeRowsSelected()} onClick={() => handleAction('activate')} variant="contained">Activate</button>
                            <button className='btn btn-sm btn-outline-primary' disabled={!table.getIsSomeRowsSelected()} onClick={() => handleAction('delete')} variant="contained">Delete</button>
                            {moreUrl && 
                                <>
                                <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(1)} variant="contained">Get more </button>
                                <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(2)} variant="contained">Get 2x more </button>
                                <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(10)} variant="contained">Get 10x more </button>
                                </>
                            }
                        </div>
                    );
                  }}                
            />

            {showDetails && <UserDetails userId={selectedId} handleCloseDetails={handleCloseDetails} currentToken={currentToken} />}

            {showDelete && <UserMassDelete selectedItems={selectedItems} handleClose={handleCloseDelete} handleCallback={handleMassDelete} />}

            <div style={{marginTop: '1.5rem'}}></div>
        </div>
    )
}

export default withAuthenticationRequired(UserCollection)