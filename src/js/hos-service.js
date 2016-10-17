
let config = require('./configure');
let pool = config.getHOSxPConnectionPool();

angular.module('app.services.HOS', [])
  .factory('HOSService', ($q) => {
    return {
      getHospitalname() {
        let q = $q.defer();
        pool.getConnection((err, conn) => {
          if (err) {
            console.log(err)
            q.reject(err)
          } else {
            conn.query('SELECT * FROM opdconfig', (err, rows) => {
              if (err) q.reject(err);
              else q.resolve(rows[0].hospitalname)
            });

            conn.release()
          }
        });

        return q.promise;
      },

      doSearch(hn) {
        let q = $q.defer();
        let sql = `select o.vstdate, o.vsttime, d.department, o.vn, o.an,
            (
              select count(*) as total
              from lab_head
              where vn=o.vn
              group by vn
            ) as labs,
            (
              SELECT count(*) as total
              FROM clinicmember_cormobidity_screen
              where vn=o.vn
            ) as efs
              from ovst as o
              left join kskdepartment as d on d.depcode=o.main_dep
              where o.hn=?
              order by o.vstdate desc
              limit 100`;
        pool.getConnection((err, conn) => {
          conn.query(sql, [hn], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows);
            }
            conn.release()
          })
        });

        return q.promise;
      },

      getInfo(hn) {
        let q = $q.defer();
        let sql = `select concat(p.pname, p.fname, " ", p.lname) as fullname,
            p.birthday, p.sex, p.cid,
            p.hn, p.addrpart, p.moopart, chw.name as chwname, amp.name as ampname,
            tmb.name as tmbname
            from patient as p 
            left join thaiaddress as chw on chw.addressid=concat(p.chwpart, '0000')
            left join thaiaddress as amp on amp.addressid=concat(p.chwpart, p.amppart, '00')
            left join thaiaddress as tmb on tmb.addressid=concat(p.chwpart, p.amppart, p.tmbpart)
            where p.hn=?
            limit 1`;
    
        pool.getConnection((err, conn) => {
          conn.query(sql, [hn], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows[0]);
            }
            conn.release()
          })
        });

        return q.promise;
      },

      getEyeFootScreen(vn) {
        let q = $q.defer();
        let sql = `select esrr.dmht_eye_screen_result_name as eye_right, esrl.dmht_eye_screen_result_name as eye_left,
          fsrr.dmht_foot_screen_result_name as foot_right, fsrl.dmht_foot_screen_result_name as foot_left
          from clinicmember as cm
          left join clinicmember_cormobidity_screen as ccs on ccs.clinicmember_id=cm.clinicmember_id
          left join clinicmember_cormobidity_eye_screen as cces on cces.clinicmember_cormobidity_screen_id=ccs.clinicmember_cormobidity_screen_id
          left join clinicmember_cormobidity_foot_screen as ccfs on ccfs.clinicmember_cormobidity_screen_id=ccs.clinicmember_cormobidity_screen_id
          left join dmht_eye_screen_result as esrr on esrr.dmht_eye_screen_result_id=cces.dmht_eye_screen_result_right_id
          left join dmht_eye_screen_result as esrl on esrl.dmht_eye_screen_result_id=cces.dmht_eye_screen_result_left_id
          left join dmht_foot_screen_result as fsrr on fsrr.dmht_foot_screen_result_id=ccfs.dmht_foot_screen_result_right_id
          left join dmht_foot_screen_result as fsrl on fsrl.dmht_foot_screen_result_id=ccfs.dmht_foot_screen_result_left_id
          where ccs.vn=?`;
    
        pool.getConnection((err, conn) => {
          conn.query(sql, [vn], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows[0]);
            }
            conn.release()
          })
        });

        return q.promise;
      },

  
      getDrug(vn, an) {
        let q = $q.defer();
        let param = null;
        let sql = null;

        if (an) {
          param = an;
          sql = `select o.qty, d.name as drugname, du.code, d.units, o.rxdate, o.rxtime
            from opitemrece as o
            inner join drugitems as d on d.icode=o.icode
            left join drugusage as du on du.drugusage=o.drugusage
            where o.an=? order by o.rxdate, o.rxtime desc`;
        } else {
          param = vn;
          sql = `select o.qty, d.name as drugname, du.code, d.units, o.rxdate, o.rxtime
            from opitemrece as o
            inner join drugitems as d on d.icode=o.icode
            left join drugusage as du on du.drugusage=o.drugusage
            where o.vn=? order by o.rxdate, o.rxtime desc`;
        }
    
        pool.getConnection((err, conn) => {
          conn.query(sql, [param], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows);
            }
            conn.release()
          })
        });

        return q.promise;
      },
  
      getLabs(vn, an) {
        let q = $q.defer();
        let param = an ? an : vn;
        console.log(param)
        let sql = `select lh.lab_order_number, lh.vn, lo.lab_order_result, 
            li.lab_items_name, li.lab_items_unit, lh.order_date, lh.order_time
            from lab_head as lh
            inner join lab_order as lo on lo.lab_order_number=lh.lab_order_number
            inner join lab_items as li on li.lab_items_code=lo.lab_items_code
            where lh.vn=?
            and lo.lab_order_result<>''`;
    
        pool.getConnection((err, conn) => {
          conn.query(sql, [param], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows);
            }
            conn.release()
          })
        });

        return q.promise;
      },
  
  
      getIpt(an) {
        let q = $q.defer();
        let sql = `select i.an, i.dchdate, i.dchtime, i.regdate, i.regtime, i.dchstts, i.dchtype,  
          i.spclty, i.ward, sp.name as spclty_name, w.name as ward_name,
          dt.name as dchstts_name, dtt.name as dchtype_name, icd.name as diagname, id.icd10,
          p.name as pttype_name
          from ipt as i
          left join spclty as sp on sp.spclty=i.spclty
          left join ward as w on w.ward=i.ward
          left join dchstts as dt on dt.dchstts=i.dchstts
          left join dchtype as dtt on dtt.dchtype=i.dchtype
          left join iptdiag as id on id.an=i.an and id.diagtype="1"
          left join icd101 as icd on icd.code=id.icd10
          left join pttype as p on p.pttype=i.pttype
          where i.an=?`;
    
        pool.getConnection((err, conn) => {
          conn.query(sql, [an], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows[0]);
            }
            conn.release()
          })
        });

        return q.promise;
      },
  
      getScreenData(vn) {
        let q = $q.defer();
        let sql = `select od.icd10, icd.name as diagname, o.vstdate, o.vsttime, o.hn, o.vn, o.bpd, o.bps, o.bw, o.cc,
          o.pe, o.pulse, o.temperature, o.rr, o.height, o.fbs, o.bmi, o.waist,p.name as pttype_name
          from opdscreen as o
          inner join ovst as ov on ov.vn=o.vn
          left join ovstdiag as od on od.vn=ov.vn and od.diagtype="1"
          left join pttype as p on p.pttype=ov.pttype
          left join icd101 as icd on icd.code=od.icd10
          where o.vn=?`;
    
        pool.getConnection((err, conn) => {
          conn.query(sql, [vn], (err, rows) => {
            if (err) {
              q.reject(err)
            } else {
              q.resolve(rows[0]);
            }
            conn.release()
          })
        });

        return q.promise;
      }
    }
  });