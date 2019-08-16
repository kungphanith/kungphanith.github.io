PostgreSQL is an open source object-relational database.  It is robust and can handle heavy workloads. PostgreSQL can be easily used on any OS family, such as Linux, BSD, Unix or Windows. In today’s post we will walk you through the setup of a replication system for PostgreSQL 9.6 in CentOS 7.

Replication is the process of copying data from one database server (master) to another database server (slave). This allows you to have a distributed database architecture across multiple machines, making a high-availability environment possible. Whenever the master server runs into problems, it is simply replaced with the slave server.

PREREQUISITES
2 CentOS 7 servers – One will act as master and the other one as slave
Root privileges in both servers
PostgreSQL 9.6
POSTGRESQL INSTALLATION
Before we can set up the actual replication, we first need to install PostgreSQL. You can download and install the PostgreSQL 9.6 repository by using the command- yum -y install https://yum.postgresql.org/9.6/redhat/rhel-7-x86_64/pgdg-centos96-9.6-3.noarch.rpm

Installation Of Postgresql

Once the repo is has been installed successfully, you will see a success message on the console as shown below-

Installation Complete

Now we can proceed to install PostgreSQL by using the command- yum -y install postgresql96-server postgresql96-contrib

Install

This will take some time and on completion, you will see a similar console message to the one below-

Complete Installation

Repeat the same procedure on both servers.

POSTGRESQL CONFIGURATION
As a first step, we need to initialize the database. To initialize, you need to go to the ‘/usr/pgsql-9.6/bin‘ directory. Use command- cd /usr/pgsql-9.6/bin and execute command ./postgresql96-setup initdb as shown below-

Initialize Database

Once you’ve done that, start the postgres service by using the command- systemctl start postgresql-9.6

Start Postgres

If you want to enable the service to start automatically on server startup, use the command- systemctl enable postgresql-9.6

Enable on startup

By default, PostgreSQL runs on port 5432. You can check the status of this port by using the netstat command. If you do not have netstat , you can use the command yum install net-tools to install netstat.

Use the command- netstat -plntu, to check the status of port 5432. The port should be in LISTEN status.

netstat 

Postgres has now been started. Now, we need to configure a password for the postgres user. Login as postgres user using- su – postgres and access postgres ‘psql‘ shell.

Su command

Use the commands shown below to set your new password.

Set Password

Then type in the logout command to exit from the postgres user console. This completes our setup and configuration of a new password.

FIREWALLD CONFIGURATION
Firewalld is the default firewall management tool for CentOS 7. To ensure it works smoothly with Postgres, we need to start the service and open the port for Postgres connections. Use the command- systemctl start firewalld to start the firewall. To enable it to start automatically when the system boots use the command- systemctl enable firewalld

firewalld

Now add the postgres service to firewalld using the commands- firewall-cmd –add-service=postgresql –permanent and firewall-cmd –reload

Add service to firewalld

Check the open port of the service using- firewall-cmd –list-all

check open port

Once again, the same procedure must be followed for both the master and slave server.

MASTER SERVER CONFIGURATION
Here we will configure the master server for the replication.This will be the main server and will allow read and write. Postgres on the master server runs on the private IP 10.0.15.10 and should perform a streaming replication to the slave servers.

Change to path /var/lib/pgsql/9.6/data and edit the configuration file postgresql.conf.

Master configuration

Uncomment the line listener_address and change the value to 10.0.15.10.

Listener Address

Next, uncomment the line wal_level and change it to hot_standby.

wal_level

To change synchronization level, use local sync. Uncomment and change it as shown below-

syncronization change

Turn on the archive_mode and archive_command= ‘cp %p /var/lib/pgsql/9.6/archive/%f’

Archive Command

To change the replication setting, uncomment the wal_sender line and set the value to 2 (since we have two servers, one master and one slave). Change wal_keep_segment to 10 as shown below-

max wal

Uncomment the line synchronous_standby_names and set the value to pgslave01

Slave Name

Save the file with all these changes. Since we have enabled the archive mode, we will create a new directory for archiving. Once the directory is created, we will allocate to it the required permissions and change the owner to the postgres user, as shown below-

archiving

Next, we will edit the pg_hba.conf file present at the directory /var/lib/pgsql/9.6/data. Use vim to edit this file. Add the below-mentioned lines to the file to configure the master and slave settings.

pg_hba.conf

Save this file and restart postgres service using the command- systemctl restart postgresql-9.6. Now, let’s create a new user with replication privileges. Create a new user – replica as shown below. The password provided in this example is Test123.

replica user

This completes Master configuration and creation of user for replication.

SLAVE SERVER CONFIGURATION
In this section, we will configure the slave server to run on IP 10.0.15.11. We will allow only read without write on this server. Begin this process by stopping the postgres instance using the command- systemctl stop postgresql-9.6

Next, go to postgres’ directory and back up the data directory as shown below-

Slave Backup Data

Create a new directory and change the ownership permissions of the directory to the postgres user as shown below-

Slave create dir

Post this login as postgres user and copy all the data directory from Master to the Slave server as replica user using the command su – postgres and pg_basebackup -h 10.0.15.10 -U replica -D /var/lib/pgsql/9.6/data -P —xlog as shown below-

Slave su

Slave backup

Type in the password when prompted. It might take some time to transfer all the data from the master to slave. Upon completion of the transfer, change the location using command – cd /var/lib/pgsql/9.6/data/ and open the file postgressql.conf with the command- vi postgresql.conf. 

Edit the following details in the postgresql.conf file, then save it-

listen_addresses = ‘10.0.15.11’
hot_standby = on
Now, it is time to create a recovery.conf file. Create the file using the command- vi recovery.conf. Paste the following configuration details in the file, then save it:

standby_mode = ‘on’
primary_conninfo = ‘host=10.0.15.10 port=5432 user=replica password=Test123 application_name=pgslave01’
trigger_file = ‘/tmp/postgresql.trigger.5432’
The primary conninfo file will contain your server details.

Change the ownership permissions of the recovery.conf file to that of postgres user using commands- chmod 600 recovery.conf and chown postgres:postgres recovery.conf. Once all changes have been saved, start the server using the command- systemctl start postgresql-9.6.

With this, we complete the slave configuration. You can use netstat to verify that the slave connection is working using the command- netstat -plntu

TESTING THE CONFIGURATION
Finally, let’s test that everything we’ve configured so far works as expected. Login to master and switch to postgres user using the command- su – postgres. Next, check the streaming state replication using the following commands:

psql -c “select application_name, state, sync_priority, sync_state from pg_stat_replication;”
psql -x -c “select * from pg_stat_replication;”
You should be able to see state value as ‘streaming‘ and sync_state as ‘sync‘.

We will now test the set up by inserting records into the master and ensuring that they’re replicated to the slave.

Login to Master and access postgresql shell using commands- su – postgres and psql. Create a table and insert some values using a couple of simple SQL queries:

CREATE TABLE test_table (test varchar(100));
INSERT INTO test_table VALUES (‘This is VPSCheap.net’);
Once the records have been inserted, login to the slave server using the commands- su – postgres and psql. Check that the data was replicated to slave using the following SQL queries:

SELECT * FROM test_table;
This should return the data that you inserted into the master server.

And that’s it! This completes the replication setup for PostgreSQL in CentOS 7 server. We hope you’ve found the tutorial useful 😉

If you’re looking for affordable servers to test this configuration out, why not look at our cheap linux VPS deals? We provide the best prices on the market, while sacrificing none of the quality.
