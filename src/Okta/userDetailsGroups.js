import React, { useMemo } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import MaterialReactTable from 'material-react-table'
import { Box, } from '@mui/material';

const UserDetailsGroups = ({ data }) => {

    if(data) {
        console.info('User groups')
        console.info(data)
    }

    //Column definitions pointing to data
    const columns = useMemo(() => [
            {id: 'id', header: 'Id', accessorKey: 'id'},
            {id: 'name', 
                header: 'Name', 
                accessorKey: 'profile.name', 
                enableHiding: false,
                Cell: ({ renderedCellValue, row }) => (
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '1rem', }} >
                      <img alt="avatar" height={25} src={row.original._links.logo[0].href} loading="lazy" style={{ borderRadius: '25%' }} />
                      <span>{renderedCellValue}</span>
                    </Box>
                )
            },
            {id: 'description', header: 'Description', accessorKey: 'profile.description'},
        ],
        [],
    )

    return (
        <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Groups</Accordion.Header>
                <Accordion.Body>

                    {data &&
                        <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableRowSelection={false} //turn off a feature
                            enableColumnOrdering={true}
                            enableGlobalFilter={true} 
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}

                            initialState={{
                                columnVisibility: { id: false },
                                density: 'compact',
                                showGlobalFilter: true,
                            }}
                        />
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsGroups