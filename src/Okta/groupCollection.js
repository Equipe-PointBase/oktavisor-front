import React, { useMemo, useState, useEffect }  from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react"
import visorConfig from '../config'
import axios from 'axios'

import MaterialReactTable from 'material-react-table'
import { Box, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

//import GroupDetails from './groupDetails'
//import GroupMassDelete from './groupMassDelete'

function GroupCollection ({data, serverFilter}) {

    //const [currentToken, setCurrentToken] = useState(data)
    const [currentToken] = useState(data)
    const [moreUrl, setMoreUrl] = useState('')
    const [myData, setMyData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                var myUrl = visorConfig.backEnd.baseUrl + '/groups'
                if(serverFilter) myUrl += '?search=' + serverFilter

                let result = await axios(myUrl, { 
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${currentToken.accessToken}`,
                        'okta-response' : 'omitCredentialsLinks',
                        'Domain': currentToken.claims.iss
                    },
                })
    
                setMyData(prevData => [...prevData, ...result.data])
                setIsLoading(false)
                setMoreUrl(result.headers['x-get-more'] ? result.headers['x-get-more'] : '')
            } 
            catch (error) {
                console.error('There has been a problem getting groups data:', error);
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
            console.error('There has been a problem getting groups data:', error)
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
    
    async function handleMassDelete() {
        //Get ids of items to delete to send them over to backend
        var itemsToDelete = selectedItems.map((row) => row.getValue('id'))

        try {
            const myUrl = visorConfig.backEnd.baseUrl + '/groups'
                await axios(myUrl, { 
                    method: 'POST',
                    headers: { 
                        Authorization: `Bearer ${currentToken.accessToken}`,
                        Domain: currentToken.claims.iss
                    },
                    data: {
                        itemsToDelete
                    } 
                        
                })
        }catch(err) {
            console.log(err)
        }
    
            
    
        //Reflect on the client 
        var res = myData.filter(obj => !itemsToDelete.includes(obj.id))
        setMyData(res)
    
        setShowDelete(false)
    }

    function formatDate(dateString) {
        return dateString ? dateString.replace('T', ' ').substring(0, 19) : ''
    }

    //Column definitions pointing to data
    const columns = useMemo(() => [
        {id: 'id', header: 'Id', accessorKey: 'id'},

        {id: 'source', header: 'Source', enableHiding: false, accessorFn: (row) => row._embedded.app ? row._embedded.app.label : 'Okta',
            filterVariant: 'select',
            Cell: ({ renderedCellValue, row }) => (
                <Box sx={{display: 'flex', alignItems: 'center', gap: '0.25rem', }} >
                    <img alt="avatar" height={25} src={row.original._links.logo[0].href} loading="lazy" style={{ borderRadius: '25%', marginRight: '0.75em' }} />
                    <span>{renderedCellValue}</span>
                </Box>
            )
        },

        {id: 'name', header: 'Name', accessorKey: 'profile.name', enableHiding: false },
        {id: 'usersCount', header: '#Members', accessorKey: '_embedded.stats.usersCount', filterVariant: 'range', filterFn: 'betweenInclusive', maxSize: 60 },
        {id: 'appsCount', header: '#Apps', accessorKey: '_embedded.stats.appsCount', filterVariant: 'range', filterFn: 'betweenInclusive', maxSize: 50 },
        {id: 'groupPushMappingsCount', header: '#PushMappings', accessorKey: '_embedded.stats.groupPushMappingsCount', filterVariant: 'range', filterFn: 'betweenInclusive', },

        {id: 'description', header: 'Description', accessorKey: 'profile.description'},
        {id: 'created', header: 'Created', accessorFn: (row) => formatDate(row.created)},
        {id: 'lastUpdated', header: 'Last modified', accessorFn: (row) => formatDate(row.lastUpdated)},
        //{id: 'type', header: 'Type', accessorKey: 'type'},
    ],
    [],
)

return(
    <div>
        <MaterialReactTable
            columns={columns}
            data={myData}
            enableFacetedValues
            state={{ showSkeletons: isLoading }}
            enableColumnResizing
            enableRowSelection
            enableMultiRowSelection
            enableColumnOrdering
            enableGlobalFilter
            enableDensityToggle
            enableFullScreenToggle={false}
            enableStickyHeader
            enableStickyFooter
            muiTableContainerProps={{ sx: { maxHeight: 630 } }}
            enableGrouping

            initialState={{
                columnVisibility: { id: false, description: false, created: false, lastUpdated: false, groupPushMappingsCount: false },
                density: 'compact',
                showGlobalFilter: true,
                pagination: { pageIndex: 0, pageSize: 50 },
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
                        <h6 className='mt-2' style={{marginLeft: '.5rem', marginRight: '1rem'}}>Groups</h6>
                        <button className='btn btn-sm btn-outline-primary' disabled={!table.getIsSomeRowsSelected()} onClick={() => handleAction('delete')} variant="contained">Delete</button>
                        {moreUrl && 
                            <>
                            <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(1)} variant="contained">Get more </button>
                            <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(2)} variant="contained">Get 2x more </button>
                            <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(10)} variant="contained">Get 10x more </button>
                            </>
                        }
                    </div>
                )
              }}                
        />


        <div style={{marginTop: '1.5rem'}}></div>
    </div>
)
}

export default withAuthenticationRequired(GroupCollection)