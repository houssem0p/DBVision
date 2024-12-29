const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const WebSocket = require('ws');
const os = require('os');

const app = express();

app.use(express.json());
app.use(cors());

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'operation', message: 'Welcome!', timestamp: Date.now() }));

  // Example of broadcasting messages
  setInterval(() => {
    ws.send(
      JSON.stringify({
        type: 'operation',
        message: `Current time: ${new Date().toLocaleTimeString()}`,
        timestamp: Date.now(),
      })
    );
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: 'Something went wrong!' });
});

// Function to send WebSocket notifications
const notifyWebSocket = (message) => {
  try {
    const notification = {
      message,
      timestamp: new Date().toISOString(),
    };

    if (wss.clients.size === 0) {
      console.log('No clients connected');
      return;
    }

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  } catch (error) {
    console.error('Error while sending WebSocket notification:', error);
  }
};

// API endpoint for database login

app.post('/api/login', async (req, res) => {
  const { host, username, password } = req.body;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });
    res.json({ success: true });
    connection.end();

    notifyWebSocket(`New user connected to the database: ${username}`);
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ success: false, message: 'Unable to connect to the database.' });
  }
});
// API endpoint to fetch blocked queries
app.get('/api/blocked-queries', async (req, res) => {
  const { host, username, password, database } = req.query;
  console.log('Fetching blocked queries with:', { host, username, password, database });
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
      database,
    });

    const [blockedQueries] = await connection.execute(`
      SELECT 
        p.id AS process_id, 
        p.user AS user, 
        p.host AS host, 
        p.db AS \`database\`, 
        p.command AS command, 
        p.time AS time, 
        p.state AS state, 
        p.info AS query 
      FROM 
        information_schema.processlist p 
      WHERE 
        p.state = 'Locked'
    `);

    console.log('Blocked queries:', blockedQueries);

    res.json({ success: true, blockedQueries });
    connection.end();
  } catch (error) {
    console.error('Error fetching blocked queries:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch blocked queries.' });
  }
});
app.get('/api/monitoring-data', async (req, res) => {
  const { host, username, password } = req.query;
  console.log('Fetching monitoring data with:', { host, username, password });
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [performanceMetrics] = await connection.execute(`
      SELECT 
        event_name, 
        COUNT_STAR AS count, 
        SUM_TIMER_WAIT AS total_wait_time 
      FROM 
        performance_schema.events_waits_summary_global_by_event_name 
      ORDER BY 
        total_wait_time DESC 
      LIMIT 10
    `);

    console.log('Performance metrics:', performanceMetrics);

    res.json({ success: true, performanceMetrics });
    connection.end();
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch monitoring data.' });
  }
});
// API endpoint to fetch query execution time
app.get('/api/query-execution-time', async (req, res) => {
  const { host, username, password } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [queryExecutionTime] = await connection.execute(`
      SELECT 
        event_name, 
        COUNT_STAR AS count, 
        SUM_TIMER_WAIT AS total_wait_time 
      FROM 
        performance_schema.events_statements_summary_by_event_name 
      ORDER BY 
        total_wait_time DESC 
      LIMIT 10
    `);

    res.json({ success: true, queryExecutionTime });
    connection.end();
  } catch (error) {
    console.error('Error fetching query execution time:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch query execution time.' });
  }
});

// API endpoint to fetch InnoDB metrics
app.get('/api/innodb-metrics', async (req, res) => {
  const { host, username, password } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [innodbMetrics] = await connection.execute(`
      SELECT 
        NAME AS metric_name, 
        COUNT AS metric_value 
      FROM 
        information_schema.INNODB_METRICS 
      WHERE 
        STATUS = 'enabled'
    `);

    res.json({ success: true, innodbMetrics });
    connection.end();
  } catch (error) {
    console.error('Error fetching InnoDB metrics:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch InnoDB metrics.' });
  }
});

// API endpoint to fetch table locks
app.get('/api/table-locks', async (req, res) => {
  const { host, username, password } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [tableLocks] = await connection.execute(`
      SELECT 
        OBJECT_SCHEMA AS schema_name, 
        OBJECT_NAME AS table_name, 
        COUNT_READ AS read_locks, 
        COUNT_WRITE AS write_locks 
      FROM 
        performance_schema.table_lock_waits_summary_by_table 
      ORDER BY 
        COUNT_WRITE DESC, COUNT_READ DESC 
      LIMIT 10
    `);

    res.json({ success: true, tableLocks });
    connection.end();
  } catch (error) {
    console.error('Error fetching table locks:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch table locks.' });
  }
});

// API endpoint to fetch index usage
app.get('/api/index-usage', async (req, res) => {
  const { host, username, password } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [indexUsage] = await connection.execute(`
      SELECT 
        OBJECT_SCHEMA AS schema_name, 
        OBJECT_NAME AS table_name, 
        INDEX_NAME AS index_name, 
        COUNT_FETCH AS fetches, 
        COUNT_INSERT AS inserts, 
        COUNT_UPDATE AS updates, 
        COUNT_DELETE AS deletes 
      FROM 
        performance_schema.table_io_waits_summary_by_index_usage 
      ORDER BY 
        fetches DESC 
      LIMIT 10
    `);

    res.json({ success: true, indexUsage });
    connection.end();
  } catch (error) {
    console.error('Error fetching index usage:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch index usage.' });
  }
});

// API endpoint to fetch disk I/O
app.get('/api/disk-io', async (req, res) => {
  const { host, username, password } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [diskIO] = await connection.execute(`
      SELECT 
        FILE_NAME AS file_name, 
        COUNT_READ AS read_count, 
        COUNT_WRITE AS write_count, 
        SUM_TIMER_READ AS read_time, 
        SUM_TIMER_WRITE AS write_time 
      FROM 
        performance_schema.file_summary_by_instance 
      ORDER BY 
        read_time DESC, write_time DESC 
      LIMIT 10
    `);

    res.json({ success: true, diskIO });
    connection.end();
  } catch (error) {
    console.error('Error fetching disk I/O:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch disk I/O.' });
  }
});

// API endpoint to fetch network traffic
app.get('/api/network-traffic', async (req, res) => {
  const { host, username, password } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [networkTraffic] = await connection.execute(`
      SELECT 
        VARIABLE_NAME AS variable_name, 
        VARIABLE_VALUE AS variable_value 
      FROM 
        performance_schema.global_status 
      WHERE 
        VARIABLE_NAME IN ('Bytes_received', 'Bytes_sent')
    `);

    res.json({ success: true, networkTraffic });
    connection.end();
  } catch (error) {
    console.error('Error fetching network traffic:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch network traffic.' });
  }
});
// API endpoint to fetch database metrics
app.get('/api/database-metrics', async (req, res) => {
  const { host, username, password, database } = req.query;
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
      database,
    });

    const [tables] = await connection.execute('SHOW TABLES');
    const metrics = await Promise.all(
      tables.map(async (table) => {
        const tableName = table[`Tables_in_${database}`];
        const [rows] = await connection.execute(`SELECT COUNT(*) AS count FROM ${tableName}`);
        return { name: tableName, value: rows[0].count };
      })
    );

    res.json({ success: true, metrics });
    connection.end();
  } catch (error) {
    console.error('Error fetching database metrics:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch database metrics.' });
  }
});

// API endpoint to fetch system and database performance metrics
app.get('/api/performance-metrics', async (req, res) => {
  const { host, username, password } = req.query;

  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    // Fetch database metrics
    const [threads] = await connection.execute("SHOW GLOBAL STATUS LIKE 'Threads_connected'");
    const [connections] = await connection.execute("SHOW GLOBAL STATUS LIKE 'Connections'");
    const [uptime] = await connection.execute("SHOW GLOBAL STATUS LIKE 'Uptime'");

    connection.end();

    // Fetch system metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Calculate CPU load
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;

    cpus.forEach((core) => {
      for (type in core.times) {
        totalTick += core.times[type];
      }
      totalIdle += core.times.idle;
    });

    const cpuLoad = ((1 - totalIdle / totalTick) * 100).toFixed(2);

    // Return combined metrics
    res.json({
      success: true,
      database: {
        threadsConnected: threads[0].Value,
        totalConnections: connections[0].Value,
        uptimeSeconds: uptime[0].Value,
      },
      system: {
        memoryUsage: {
          total: totalMemory,
          free: freeMemory,
          used: usedMemory,
        },
        cpuLoad: parseFloat(cpuLoad),
      },
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch performance metrics.' });
  }
});

app.get('/api/sgbd-overview', async (req, res) => {
  const { host, username, password } = req.query;

  try {
    console.log('Connecting to SGBD with:', { host, username, password });

    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    console.log('Connected to SGBD');

    const [versionRows] = await connection.execute('SELECT VERSION() as version');
    const [uptimeRows] = await connection.execute('SHOW GLOBAL STATUS LIKE "Uptime"');
    const [openTablesRows] = await connection.execute('SHOW GLOBAL STATUS LIKE "Open_tables"');
    const [totalQueriesRows] = await connection.execute('SHOW GLOBAL STATUS LIKE "Queries"');

    console.log('Query results:', { versionRows, uptimeRows, openTablesRows, totalQueriesRows });

    if (versionRows.length === 0 || uptimeRows.length === 0 || openTablesRows.length === 0 || totalQueriesRows.length === 0) {
      throw new Error('No data returned from database query.');
    }

    const sgbd = {
      version: versionRows[0].version,
      uptime: uptimeRows[0].Value,
      openTables: openTablesRows[0].Value,
      totalQueries: totalQueriesRows[0].Value,
    };

    console.log('Fetched SGBD data:', sgbd);

    res.json({ success: true, sgbd });
    connection.end();
  } catch (error) {
    console.error('Error fetching SGBD overview:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});
// API endpoint to fetch databases
app.get('/api/databases', async (req, res) => {
  const { host, username, password } = req.query;

  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
    });

    const [databases] = await connection.execute('SHOW DATABASES');

    res.json({ success: true, databases: databases.map(db => db.Database) });
    connection.end();
  } catch (error) {
    console.error('Error fetching databases:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch databases.' });
  }
});
// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});