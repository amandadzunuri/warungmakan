var express = require('express');
var router = express.Router();

//var authentication_mdl = require('../middlewares/authentication'); 
var session_store;

router.get('/', /*authentication_mdl.is_login,*/ function(req, res, next){
    req.getConnection(function(err, connection){
        var query = connection.query('SELECT * FROM menu ORDER BY nama ASC', function(err, rows){
            if(err)
            var errornya = ("Error Selecting : %s ", err);
            req.flash('msg_error', errornya);
            res.render('menu/list', {title: "Menu", data: rows, session_store: req.session});
        });
    });
});
module.exports = router;

router.post('/add', /*authentication_mdl.is_login,*/ function(req, res, next){
    req.assert('nama', 'Tolong isi nama menu').notEmpty();
    var errors = req.validationErrors();
    if(!errors){
        v_kode = req.sanitize('kode').escape().trim();
        v_nama = req.sanitize('nama').escape().trim();
        v_kategori = req.sanitize('kategori').escape().trim();
        v_stok = req.sanitize('stok').escape().trim();
        v_harga = req.sanitize('harga').escape().trim();

        var menu = {
            kode: v_kode,
            nama: v_nama,
            kategori: v_kategori,
            stok: v_stok,
            harga: v_harga
        }

        var insert_sql = 'INSERT INTO menu SET ?';
        req.getConnection(function(err, connection){
            var query = connection.query(insert_sql, menu, function(err, result){
                if(err){
                    var errors_detail = ("Error Insert : %s ", err);
                    req.flash('msg_error', errors_detail);
                    res.render('menu/add-menu', {
                        kode: req.param('kode'),
                        nama: req.param('nama'),
                        kategori: req.param('kategori'),
                        stok: req.param('stok'),
                        harga: req.param('harga'),
                    });
                } else{
                    req.flash('msg_info', 'Membuat menu sukses');
                    res.redirect('/menu');
                }
            });
        });
    } else{
        console.log(errors);
        errors_detail = "Sorry there are errors <ul>";
        for(i in errors) {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'</li>';
        }
        errors_detail += "</ul>";
        req.flash('msg_error', errors_detail);
        res.render('menu/add-menu', {
            nama: req.param('nama'),
            kategori: req.param('kategori')
        });
    }
});

router.get('/add', function(req, res, next){
    res.render('menu/add-menu', {
        title: 'Tambah Menu',
        kode: '',
        nama: '',
        kategori: '',
        stok: '',
        harga: ''
    });
});

router.get('/edit/(:kode)', /*authentication_mdl.is_login,*/ function(req, res, next){
    var kode = req.params.kode;
    req.getConnection(function(err,connection){
       connection.query('SELECT * FROM menu WHERE kode = ?',[kode],function(err,rows){
          if(err)
             console.log("Error Selecting : %s ",err );
              res.render('menu/edit',{title:"Edit",data:rows[0]});                          
           });
      });
});;


router.put('/edit/(:kode)', /*authentication_mdl.is_login,*/ function(req, res, next){
    var input = JSON.parse(JSON.stringify(req.body));
    var kode = req.params.kode;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            kode    : input.kode,
            nama    : input.nama,
            kategori : input.kategori,
            stok   : input.stok,
            harga   : input.harga 
        
        };
        
        connection.query("UPDATE menu set ? WHERE kode = ? ",[data,kode], function(err, rows)
        {
  
            if(err){
                var errors_detail = ("Error Update : %s ", err);
                req.flash('msg_error', errors_detail);
                res.render('menu/edit', {
                    kode: req.param('kode'),
                    nama: req.param('nama'),
                    kategori: req.param('kategori'),
                    stok: req.param('stok'),
                    harga: req.param('harga'),
                });
            } else{
                req.flash('msg_info', 'Update menu sukses');
                res.redirect('/menu');
            }
          
        });
    
    });
});
router.delete('/delete/(:kode)', /*authentication_mdl.is_login,*/ function(req, res, next){
          
    var kode = req.params.kode;
   
    req.getConnection(function (err, connection) {
       
       connection.query("DELETE FROM menu  WHERE kode = ? ",[kode], function(err, rows)
       {
           
            if(err)
                console.log("Error deleting : %s ",err );
           
            res.redirect('/menu');
            
       });
       
    });
});