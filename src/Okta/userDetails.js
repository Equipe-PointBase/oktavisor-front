import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap';
import visorConfig from '../config'

import UserDetailsProfile from './userDetailsProfile'
import UserDetailsGroups from './userDetailsGroups'
import UserDetailsApps from './userDetailsApps'
import UserDetailsFactors from './userDetailsFactors'

const UserDetails = ({ userId, handleCloseDetails, currentToken }) => {
  const [detailData, setDetailData] = useState(null)

  useEffect(() => {

    async function fetchData() {
        try {
            const myUrl = visorConfig.backEnd.baseUrl + '/users/' + userId
            let result = await axios(myUrl, { 
                method: 'GET',
                headers: { 
                    Authorization: `Bearer ${currentToken.accessToken}`,
                    Domain: currentToken.claims.iss
                },
            })
            
            //console.info(result)
            setDetailData(result.data)
            var myModal = new bootstrap.Modal(document.getElementById('modalDetails'))
            myModal.show()
        } 
        catch (error) {
            console.error('There has been a problem getting user details: ', error)
        }
    }
    fetchData()

  }, [userId])








  return (
    <div className="modal fade" id="modalDetails" tabIndex="-1" aria-labelledby="modalDetails" aria-hidden="false">
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">

          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">{detailData ? detailData[0].profile.login : userId}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseDetails}></button>
          </div>

          <div className="modal-body">

            <div className="container-fluid">
              <div className="row">

                <div className='col-6'>
                  <UserDetailsProfile data={detailData ? detailData[0] : null} />
                  <br/>
                  <UserDetailsFactors  data={detailData ? {factors: detailData[3], catalog: detailData[4]} : null} />
                  <br/>
                  <UserDetailsGroups  data={detailData ? detailData[1] : null} />
                  <br/>
                </div>

                <div className='col-6'>
                  <UserDetailsApps  data={detailData ? detailData[2] : null} />
                  <br/>
                </div>

              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails