import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Geo from './Geo';
import country from "./country_code.json";

const defaultparams = {
  country_id: '',
  limit: '100',
}
const defaulterrors = {
  country_error: false,
  limit_error: false
}

function Launch() {

  const [data, setData] = useState({})
  const [params, setParams] = useState(defaultparams)
  const [errors, setErrors] = useState(defaulterrors)
  const [flag, setFlag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [map, setMap] = useState({});


  function handleValidation() {
    if (params.country_id.length !== 2) {
      setErrors({country_error:true})
      return false;
    }
    if (!params.country_id.match("[a-zA-Z][a-zA-Z]")) {
      setErrors({country_error:true})
      return false;
    }
    if (params.limit === "") {
      params.limit = "100";
      return true;
    }

    if (!parseInt(params.limit) || params.limit % 1 !== 0 || parseInt(params.limit) > 100000 ||  0 >= parseInt(params.limit)) {
      setErrors({limit_error:true})
      return false;
    }
    
    setErrors({limit_error:false})
    setErrors({country_error:false})
    return true;
  }
  const search = (evt) => {
    evt.preventDefault();
    if (handleValidation()) {

      const searchParams = new URLSearchParams(params);
      console.log(params);
      setLoading(true)
      axios.get('https://docs.openaq.org/v2/locations?' + searchParams.toString())
      .then(res => {
          console.log(res.data);
          setData(res.data)
          setLoading(false)
          
          const feature = country.find(item => {return item.features[0]['ISO3166-1-Alpha-2']===params.country_id.toUpperCase()})
          console.log(feature)
          if (feature) {
            setMap(feature)
            setFlag(true);
            setErrors({country_error:false})
          }
          else{
            setErrors({country_error:true})
          }
      })
    }
  }

const handleSearchChanges = (evt) => {
    const { name, value } = evt.target;
    setParams({ ...params, [name]: value.trim() });
    setFlag(false)
}
  return (
    <div className="Launch">
        <h1 className='main-title'>Country's Air Quality</h1>
        <div className='select-category-search-form'>
            <input className='mx-2'  value={params.country_id} onChange={handleSearchChanges} placeholder='Search Country' name="country_id" type='text' />
            <input className='col-md-1' value={params.limit} onChange={handleSearchChanges} placeholder='limit' name="limit" type='text' />
            <Button onClick={search} color="success" className="font-weight-bold">Search</Button>
            <div>
              <span style={{ color: "red" }}>{errors.country_error ? "Invalid country code (two letter country code)": null}</span>
              <span style={{ color: "red" }}>{errors.limit_error ? "Invalid limit number(maximum: 100000)": null}</span>
            </div>
        </div>
        <div className="d-flex align-items-center">
        {loading ? <strong>Loading...</strong>: null}
    </div>
          {flag ? 
          <Geo data={data} map={map}></Geo> 
          : null
          }
    </div>
  );
}

export default Launch;