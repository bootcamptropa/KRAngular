/* 
 * Global Services Test Módule
 */
angular.module('globalService', ['LocalStorageModule'])
        .factory('globalService', ['$q', '$log','localStorageService',
            function ($q, $log,localStorageService) {
                return {
                    getUrlParam: function (parameterName) {
                        parameterName += "=";
                        var parameterValue = (location.hash.indexOf(parameterName)) ? location.hash.substring(location.hash.indexOf(parameterName) + parameterName.length) : null;
                        if (parameterValue !== null && parameterValue.indexOf('&') >= 0) {
                            parameterValue = parameterValue.substring(0, parameterValue.indexOf('&'));
                        }
                        return parameterValue;
                    },
                    setStorageItem: function(key,value,expireCookieDays){
                        var v = JSON.stringify(value);
                        if(localStorageService.isSupported){
                            return localStorageService.set(key,v);
                        }else if(localStorageService.cookie.isSupported){
                            if(expireCookieDays) {
                                return localStorageService.cookie.set(key, value, expireCookieDays);
                            } else {
                                return localStorageService.cookie.set(key, value,1);
                            }
                        }else{
                            alert('Unable to save cookie or localStorage in your browser');
                            return false;
                        }
                    },
                    getStorageItem: function(key){
                        var item = '';
                        var value = {};
                        if(localStorageService.isSupported){
                            value = localStorageService.get(key);
                        }else if(localStorageService.cookie.isSupported){
                            value = localStorageService.cookie.get(key);
                        }else{
                            alert('No storage and cookies aviable for your browser');
                        }
                        if(value) {
                            return JSON.parse(value);
                        } else {
                            return {};
                        }
                    },
                    removeStorage: function(key){
                        if(localStorageService.isSupported){
                            return localStorageService.remove(key);
                        }else if(localStorageService.cookie.isSupported){
                            return localStorageService.cookie.remove(key);
                        }else{
                            return false;
                        }
                    },
                    clearStorage: function(){
                        return localStorageService.clearAll();
                    },
                    base64Encode: function(data){
                            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                                ac = 0,
                                enc = '',
                                tmp_arr = [];

                            if (!data) {
                                return data;
                            }

                            do { // pack three octets into four hexets
                                o1 = data.charCodeAt(i++);
                                o2 = data.charCodeAt(i++);
                                o3 = data.charCodeAt(i++);

                                bits = o1 << 16 | o2 << 8 | o3;

                                h1 = bits >> 18 & 0x3f;
                                h2 = bits >> 12 & 0x3f;
                                h3 = bits >> 6 & 0x3f;
                                h4 = bits & 0x3f;

                                // use hexets to index into b64, and append result to encoded string
                                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
                            } while (i < data.length);

                            enc = tmp_arr.join('');

                            var r = data.length % 3;

                            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

                    },
                    base64Decode: function(data){
                        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                            ac = 0,
                            dec = '',
                            tmp_arr = [];

                        if (!data) {
                            return data;
                        }

                        data += '';

                        do { // unpack four hexets into three octets using index points in b64
                            h1 = b64.indexOf(data.charAt(i++));
                            h2 = b64.indexOf(data.charAt(i++));
                            h3 = b64.indexOf(data.charAt(i++));
                            h4 = b64.indexOf(data.charAt(i++));

                            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                            o1 = bits >> 16 & 0xff;
                            o2 = bits >> 8 & 0xff;
                            o3 = bits & 0xff;

                            if (h3 == 64) {
                                tmp_arr[ac++] = String.fromCharCode(o1);
                            } else if (h4 == 64) {
                                tmp_arr[ac++] = String.fromCharCode(o1, o2);
                            } else {
                                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                            }
                        } while (i < data.length);

                        dec = tmp_arr.join('');

                        return dec.replace(/\0+$/, '');
                    },
                    getGeolocalization: function(){
                        var def = $q.defer();
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(data){

                                def.resolve(data);
                            }, function (err) {
                                def.reject(err);
                            });
                        }
                        return def.promise;

                    }
                };
            }]);



