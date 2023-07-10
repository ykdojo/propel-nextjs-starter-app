import { Leaderboard } from '@propeldata/react-leaderboard'
import { format } from 'date-fns'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import {
  DateRangePicker,
  Layout,
  Loader,
  DimensionsSelect
} from '../../components'
import { useDataFetching } from '../../utils'

const TODAY_DATE = new Date()
const FOURTEEN_DAYS_AGO = new Date(TODAY_DATE - 14 * 24 * 60 * 60 * 1000)

export default function LeaderboardPage() {
  const [uniqueName, setUniqueName] = React.useState()
  const [description, setDescription] = React.useState()
  const [dimensionsList, setDimensionsList] = React.useState()
  const [dimensions, setDimensions] = React.useState([])
  const [startDate, setStartDate] = React.useState(FOURTEEN_DAYS_AGO)
  const [stopDate, setStopDate] = React.useState(TODAY_DATE)

  const router = useRouter()
  const { metricId } = router.query

  const { isLoading, accessToken, metric } = useDataFetching(metricId)

  React.useEffect(() => {
    if (!metric) {
      return
    }
    setUniqueName(metric.uniqueName)
    setDescription(metric.description)
    setDimensionsList(metric.dimensions)
  }, [metric])

  return (
    <>
      <Head>
        <title>Propel Sample Leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        title={{
          url: 'https://www.propeldata.com/docs/metrics/leaderboard',
          text: 'Leaderboard'
        }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h4 style={{ marginTop: '2rem' }}>{uniqueName}</h4>
            <p>{description}</p>
            <DateRangePicker
              startDate={startDate}
              stopDate={stopDate}
              setStartDate={setStartDate}
              setStopDate={setStopDate}
            />
            <DimensionsSelect
              dimensionsList={dimensionsList}
              dimensions={dimensions}
              setDimensions={setDimensions}
            />
            {dimensions.length === 0 && (
              <div style={{ margin: '3em auto' }}>
                Please select a dimension
              </div>
            )}
            {uniqueName && dimensions.length > 0 && (
              <Leaderboard
                variant="bar"
                styles={{
                  bar: {
                    thickness: 15,
                    borderWidth: '0',
                    borderRadius: 2,
                    borderColor: '#94A3B8',
                    backgroundColor: '#6941C6',
                    hoverBackgroundColor: 'rgba(158, 119, 237, 0.60)'
                  },
                  canvas: {
                    height: 400
                  }
                }}
                query={{
                  metric: uniqueName,
                  accessToken,
                  timeRange: {
                    start: format(startDate, 'yyyy-MM-dd'),
                    stop: format(stopDate, 'yyyy-MM-dd')
                  },
                  rowLimit: 8,
                  dimensions
                }}
              />
            )}
          </>
        )}
      </Layout>
    </>
  )
}
