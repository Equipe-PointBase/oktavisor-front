import React, { useMemo, useState, useEffect }  from 'react'
import { withAuthenticationRequired } from "@auth0/auth0-react"
import visorConfig from '../config'
import axios from 'axios'

import MaterialReactTable from 'material-react-table'
import { Box } from '@mui/material'

function SchemasCollection ({data}) {

    //console.info(data)
    //console.info(serverFilter)
    const [currentToken, setCurrentToken] = useState(data)
    const [myData, setMyData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [selectedId, setSelectedId] = useState('')

    useEffect(() => {
        async function fetchData() {
            try {
                var myUrl = visorConfig.backEnd.baseUrl + '/schemas'

                let result = await axios(myUrl, { 
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${currentToken.accessToken}`,
                        'Domain': currentToken.claims.iss
                    },
                })
    
                setMyData(result.data)
                setIsLoading(false)
            } 
            catch (error) {
                console.error('There has been a problem getting schema data:', error)
            }
        }
        fetchData()
    }, [])


    //Column definitions pointing to data
    const columns = useMemo(() => [
        {id: 'schema', header: 'Schema', accessorKey: 'schema.name', size: 80},
        {id: 'title', header: 'Title', accessorKey: 'title'},
        {id: 'name', header: 'Name', accessorKey: 'name'},
        {id: 'type', header: 'Type', accessorKey: 'type'},
        {
            id: 'custom', 
            header: 'Custom', 
            accessorFn: (row) => row.isCustom ? 'CUSTOM' : 'BASE',
            Cell: ({ cell }) => (
                <Box
                  component="span"
                  sx={(theme) => ({
                    backgroundColor: cell.getValue() === 'CUSTOM' ? theme.palette.warning.light : theme.palette.info.light,
                    borderRadius: '0.25rem',
                    color: '#fff',
                    p: '0.25rem'
                  })}
                >
                  {cell.getValue()}
                </Box>
              ),
        },
        {id: 'master', header: 'Master', accessorKey: 'master.type'},
    ],
    [],
    )

    return (
        <div>
            {myData &&
                <MaterialReactTable
                    columns={columns}
                    data={myData}

                    state={{ showSkeletons: isLoading }}
                    enableRowSelection={false}
                    enableMultiRowSelection={false}
                    enableColumnResizing
                    enableColumnOrdering={false}
                    enableGlobalFilter
                    enableDensityToggle
                    enableFullScreenToggle={false}
                    enableStickyHeader
                    enableStickyFooter
                    muiTableContainerProps={{ sx: { maxHeight: 630 } }}
                    enableGrouping


                    initialState={{
                        //columnVisibility: { id: false, created: false, activated: false, statusChanged: false, lastLogin: false, lastUpdated: false, passwordChanged: false },
                        density: 'compact',
                        showGlobalFilter: true,

                        expanded: false,         //expand all groups by default
                        grouping: ['schema'],   //an array of columns to group by by default (can be multiple)
                        sorting: [{ id: 'title', desc: false }], //sort by title by default
                        pagination: { pageIndex: 0, pageSize: 50 },
                    }}

                    renderTopToolbarCustomActions={({ table }) => {
                        return (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <h6 className='mt-2' style={{marginLeft: '.5rem', marginRight: '1rem'}}>Schemas &amp; Attributes</h6>
                            </div>
                        )
                    }}
                />
            }
            <div style={{ marginTop: '1.5rem' }}></div>
        </div>
    )
      
}

export default withAuthenticationRequired(SchemasCollection)