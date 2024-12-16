import React, { useMemo } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import MaterialReactTable from 'material-react-table'
import { Box, } from '@mui/material';

const UserDetailsApps = ({ data }) => {

    //Column definitions pointing to data
    const columns = useMemo(() => [
        {id: 'id', header: 'Id', accessorKey: 'id'},
        {id: 'name', 
            header: 'Name', 
            accessorKey: 'label', 
            enableHiding: false,
            Cell: ({ renderedCellValue, row }) => (
                <Box sx={{display: 'flex', alignItems: 'center', gap: '1rem', }} >
                  <img alt="logo" className='logo-img' src={row.original._links.logo[0].href} loading="lazy" style={{ borderRadius: '20%' }} />
                  <span>{renderedCellValue}</span>
                </Box>
            )
        },
        {id: 'userName', header: 'User Name', accessorKey: '_embedded.user.credentials.userName'},
        {id: 'assignmentType', header: 'Assignment', accessorKey: '_embedded.user.scope'},
        {id: 'status', header: 'Status', accessorKey: '_embedded.user.status'},
        ],
        [],
    )


    return (
        <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Assigned apps</Accordion.Header>
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
                            enableStickyHeader={true}
                            enableStickyFooter={true}         
                            muiTableContainerProps={{ sx: { maxHeight: 500 } }}
                            enableGrouping={false}

                            initialState={{
                                columnVisibility: { id: false },
                                density: 'compact',
                                showGlobalFilter: true,
                                pagination: { pageIndex: 0, pageSize: 50 },
                            }}
                        />
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default UserDetailsApps