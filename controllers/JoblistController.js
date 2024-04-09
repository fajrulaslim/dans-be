const express = require("express");
const axios = require('axios')

const getAPI = async (url, req, res) => {
  try {
    const result = await axios.get(url)
    return result.data
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error
    })
  }
}

const getAllJoblist = async (req, res) => {
  const page = req.query.page || 1
  const description = req.query.description || ''
  const location = req.query.location || ''
  const type =  req.query.full_time ? ( req.query.full_time === 'true' ? "Full Time" : "Part Time" ) : ''

  const per_page = 10

  if(page < 1) {
    return res.status(404).json({
      status: "error",
      message: 'Page minimal 1.',
    });
  }

  try {
    const urlDataAll =  `${process.env.JOB_LIST_API}?description=${description}&location=${location}&type=${type}`
    const urlData = `${process.env.JOB_LIST_API}?page=${page}&description=${description}&location=${location}&type=${type}`

    const all = await getAPI(urlDataAll)

    const can_next = Math.ceil(all.length / per_page)
    if(all.length > 0 && page > can_next) {
      return res.status(404).json({
        status: "error",
        message: 'Page not defined.',
      });
    }

    const data = await getAPI(urlData)

    res.status(200).json({
      status: "Success",
      message: "Success get data",
      data: all.length > 0 ? data : [],
      pagination: {
        total_data: all.length,
        total_page: Math.ceil(all.length / per_page),
        per_page,
        current_page: page,
        next_page: Math.ceil(all.length / per_page) > page && page + 1,
        prev_page: page > 1 && page - 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

const getJobDetail = async (req, res) => {
  const { id } = req.params

  if(!id) {
    return res.status(404).json({
      status: "error",
      message: 'Id not found.',
    });
  }

  try {
    const url = `${process.env.JOB_DETAIL_API}/${id}`
    const data = await getAPI(url)

    if(!data.id) {
      return res.status(404).json({
        status: "error",
        message: 'Data not found.',
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Success get data",
      data: data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
    getAllJoblist,
    getJobDetail
}; 