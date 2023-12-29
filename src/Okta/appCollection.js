import React, { useMemo, useState, useEffect }  from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react"
import visorConfig from '../config'
import axios from 'axios'

import MaterialReactTable from 'material-react-table'
import { Box, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'


function AppCollection ({data, serverFilter}) {

    //const [currentToken, setCurrentToken] = useState(data)
    const [currentToken] = useState(data)
    const [moreUrl, setMoreUrl] = useState('')
    const [myData, setMyData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                var myUrl = visorConfig.backEnd.baseUrl + '/apps'
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
            console.error('There has been a problem getting more apps data:', error)
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
    
    function formatDate(dateString) {
        return dateString ? dateString.replace('T', ' ').substring(0, 19) : ''
    }

    //Column definitions pointing to data
    const columns = useMemo(() => [
        {id: 'id', header: 'Id', accessorKey: 'id'},

        {id: 'label', header: 'Label', enableHiding: false, accessorKey: 'label',
            filterVariant: 'select',
            Cell: ({ renderedCellValue, row }) => (
                <Box sx={{display: 'flex', alignItems: 'center', gap: '0.25rem', }} >
                    <img alt="avatar" height={25} src={row.original._links.logo[0].href} loading="lazy" style={{ borderRadius: '25%', marginRight: '0.75em' }} />
                    <span>{renderedCellValue}</span>
                </Box>
            )
        },

        {id: 'signOnMode', header: 'Signon Mode', accessorKey: 'signOnMode', enableHiding: false },

        {id: 'created', header: 'Created', accessorFn: (row) => formatDate(row.created)},
        {id: 'lastUpdated', header: 'Last modified', accessorFn: (row) => formatDate(row.lastUpdated)},
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
                columnVisibility: { id: false, created: false, lastUpdated: false },
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
                }
        
                return (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <h6 className='mt-2' style={{marginLeft: '.5rem', marginRight: '1rem'}}>Apps</h6>
                        {moreUrl && 
                            <>
                            <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(1)} variant="contained">Get more </button>
                            <button className='btn btn-sm btn-warning' onClick={() => handleGetMore(2)} variant="contained">Get 2x more </button>
                            </>
                        }
                    </div>
                )
              }}                
        />

    </div>
)
}

export default withAuthenticationRequired(AppCollection)