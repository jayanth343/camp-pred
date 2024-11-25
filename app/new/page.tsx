"use client";

export default function RelationalSchema() {
  return (
    <div className="min-h-screen bg-white p-12 relative">
      <style jsx>{`
        .table {
          border: 2px solid black;
          margin: 20px 0;
          display: inline-block;
          background: #f9f9f9;
        }
        .table-header {
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 1.2em;
          color: black;
        }
        .table-row {
          display: flex;
          border: 1px solid black;
        }
        .table-cell {
          padding: 8px 16px;
          border-right: 1px solid black;
          font-family: monospace;
          color: black;
        }
        .table-cell:last-child {
          border-right: none;
        }
        .primary-key {
          color: red;
        }
        .foreign-key {
          color: blue;
        }
        .line {
          position: absolute;
          stroke: black;
          stroke-width: 2;
        }
      `}</style>

      <div className="table-container">
        {/* USER table */}
        <div className="mb-12" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">USER</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key">userid</div>
              <div className="table-cell">Name</div>
              <div className="table-cell">Email</div>
              <div className="table-cell">Username</div>
              <div className="table-cell">TYPE</div>
              <div className="table-cell">Password</div>
            </div>
          </div>
        </div>

        {/* PROFILE table */}
        <div className="mb-12 ml-24" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">PROFILE</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell foreign-key">userid</div>
              <div className="table-cell">Name</div>
              <div className="table-cell">DOB</div>
              <div className="table-cell">Phone</div>
              <div className="table-cell">Email</div>
              <div className="table-cell">Resume</div>
            </div>
          </div>
        </div>

        {/* JOBS table */}
        <div className="mb-12 ml-48" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">JOBS</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key">job_id</div>
              <div className="table-cell">title</div>
              <div className="table-cell">company_name</div>
              <div className="table-cell">salary</div>
              <div className="table-cell">location</div>
              <div className="table-cell">type</div>
              <div className="table-cell">app_deadline</div>
            </div>
          </div>
        </div>

        {/* SKILLS table */}
        <div className="mb-12" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">SKILLS</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key foreign-key">user_id</div>
              <div className="table-cell">skillname</div>
              <div className="table-cell">skill_level</div>
              <div className="table-cell">skill_id</div>
            </div>
          </div>
        </div>

        {/* EDUCATION table */}
        <div className="mb-12 ml-24" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">EDUCATION</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key">institute</div>
              <div className="table-cell foreign-key">userid</div>
              <div className="table-cell">major</div>
              <div className="table-cell">marks</div>
              <div className="table-cell">marks_type</div>
              <div className="table-cell">type</div>
              <div className="table-cell">start_date</div>
              <div className="table-cell">date_date</div>
            </div>
          </div>
        </div>

        {/* EXPERIENCE table */}
        <div className="mb-12 ml-48" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">EXPERIENCE</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key foreign-key">user_id</div>
              <div className="table-cell primary-key">company_name</div>
              <div className="table-cell primary-key">start</div>
              <div className="table-cell">end</div>
              <div className="table-cell">position</div>
              <div className="table-cell">type</div>
            </div>
          </div>
        </div>

        {/* APPLICATION table */}
        <div className="mb-12" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">APPLICATION</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key foreign-key">user_id</div>
              <div className="table-cell primary-key foreign-key">job_id</div>
              <div className="table-cell">status</div>
              <div className="table-cell">cover_letter</div>
              <div className="table-cell">resume</div>
            </div>
          </div>
        </div>

        {/* PREDICTIONS table */}
        <div className="mb-12 ml-24" style={{ position: 'relative', top: '0' }}>
          <div className="table-header">PREDICTIONS</div>
          <div className="table">
            <div className="table-row">
              <div className="table-cell primary-key foreign-key">job_id</div>
              <div className="table-cell primary-key foreign-key">user_id</div>
              <div className="table-cell">strengths</div>
              <div className="table-cell">improvements</div>
              <div className="table-cell">otherjobsuggestions</div>
              <div className="table-cell">analysis</div>
              <div className="table-cell">success_probability</div>
              <div className="table-cell">gen_at</div>
            </div>
          </div>
        </div>

        {/* Connection lines using SVG */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none bg-black text-black" style={{ zIndex: -1 }}>
          {/* Connection lines */}
          <line x1="120" y1="50" x2="200" y2="150" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="120" y1="150" x2="200" y2="250" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="200" y1="150" x2="300" y2="150" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="200" y1="250" x2="300" y2="250" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="120" y1="250" x2="200" y2="350" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="120" y1="350" x2="200" y2="450" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="200" y1="350" x2="300" y2="350" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <line x1="200" y1="450" x2="300" y2="450" className="line text-black bg-black" markerEnd="url(#arrowhead)" />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="black" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
