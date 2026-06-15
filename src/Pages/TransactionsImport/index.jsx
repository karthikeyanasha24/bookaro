import React, { useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
import Layout from "../../components/global/layout";

const TransactionsImport = () => {
  const [localPath, setLocalPath] = useState('');
  const [years, setYears] = useState('2014,2024');
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [returnValue, setReturnValue] = useState(null);
  const [polling, setPolling] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [retrying, setRetrying] = useState({});

  React.useEffect(() => {
    let interval = null;
    if (jobId && polling) {
      const fetchStatus = async () => {
        try {
          const res = await ApiClient.get(`upload/admin/importStatus/${jobId}`);
          if (res && res.success) {
            setStatus(res.state || null);
            setProgress(res.progress || null);
            setAttempts(res.attemptsMade || 0);
            setReturnValue(res.returnvalue || null);

            if (res.state === 'completed' || res.state === 'failed') {
              setPolling(false);
            }
          }
        } catch (e) {
          // ignore transient errors
        }
      };

      // initial fetch then interval
      fetchStatus();
      interval = setInterval(fetchStatus, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, polling]);

  // fetch recent import jobs for admin UI
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await ApiClient.get('upload/admin/importJobs');
      if (res && res.success) {
        setJobs(res.jobs || []);
      }
    } catch (e) {
      console.error('Failed to fetch import jobs', e);
    }
    setLoadingJobs(false);
  };

  React.useEffect(() => { fetchJobs(); }, []);

  const startImport = async () => {
    setStatus('starting');
    try {
      const body = { path: localPath, years: years.split(',').map(y => y.trim()) };
      const res = await ApiClient.post('upload/admin/importFromLocal', body);
      if (res.success) {
        setJobId(res.jobId);
        setStatus('started');
        setPolling(true);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Import Past Transactions</h2>
        <div className="mb-3">
          <label className="block mb-1">Local path (server)</label>
          <input className="w-full p-2 border rounded" value={localPath} onChange={e => setLocalPath(e.target.value)} placeholder="/path/to/03_Past transactions" />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Years (comma separated)</label>
          <input className="w-full p-2 border rounded" value={years} onChange={e => setYears(e.target.value)} />
        </div>
        <div className="mb-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={startImport}>Start Import</button>
        </div>
        {jobId && <div className="mt-4">Job started: <b>{jobId}</b></div>}
        {status && <div className="mt-2">Status: {status}</div>}
        {progress && (
          <div className="mt-2">
            <div>Progress: {progress.percent ?? ''}%</div>
            <div>File: {progress.file ?? ''} ({progress.fileIndex ?? ''}/{progress.totalFiles ?? ''})</div>
            <div>Inserted: {progress.inserted ?? ''}</div>
          </div>
        )}
        {attempts > 0 && <div className="mt-2">Attempts: {attempts}</div>}
        {returnValue && <div className="mt-2">Result: {JSON.stringify(returnValue)}</div>}
        <div className="mt-3">
          <button className="px-3 py-1 bg-slate-600 text-white rounded mr-2" onClick={() => setPolling(s => !s)}>{polling ? 'Stop Polling' : 'Start Polling'}</button>
          <a className="px-3 py-1 bg-blue-600 text-white rounded" href="/admin/queues" target="_blank" rel="noreferrer">Open Job Queue UI</a>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Import Jobs</h3>
          <div className="mb-2">
            <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={fetchJobs} disabled={loadingJobs}>{loadingJobs ? 'Refreshing...' : 'Refresh Jobs'}</button>
          </div>
          <div className="overflow-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">JobId</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Params</th>
                  <th className="p-2 text-left">Progress</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.jobId} className="border-t">
                    <td className="p-2">{j.jobId}</td>
                    <td className="p-2">{j.status}</td>
                    <td className="p-2">{j.createdAt ? new Date(j.createdAt).toLocaleString() : ''}</td>
                    <td className="p-2"><pre className="whitespace-pre-wrap max-w-xs">{JSON.stringify(j.params || {}, null, 2)}</pre></td>
                    <td className="p-2"><pre className="whitespace-pre-wrap">{JSON.stringify(j.progress || {})}</pre></td>
                    <td className="p-2">
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                        disabled={!!retrying[j.jobId]}
                        onClick={async () => {
                          setRetrying(r => ({ ...r, [j.jobId]: true }));
                          try {
                            const res = await ApiClient.post(`upload/admin/importJobs/${encodeURIComponent(j.jobId)}/retry`);
                            alert(JSON.stringify(res));
                            fetchJobs();
                          } catch (e) {
                            alert('Retry failed: ' + (e && e.message));
                          }
                          setRetrying(r => ({ ...r, [j.jobId]: false }));
                        }}
                      >{retrying[j.jobId] ? 'Retrying...' : 'Retry'}</button>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td className="p-2" colSpan={6}>No recent jobs</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">Note: this triggers a background import job on the backend; monitor progress here or via the Queue UI.</p>
      </div>
    </Layout>
  );
};

export default TransactionsImport;
