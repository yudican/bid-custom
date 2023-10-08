<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <title>Surat Jalan</title>
    <style>
        @font-face {
            font-family: 'Poppins';
            font-weight: normal;
            font-style: normal;
            font-variant: normal;
            /* src: url("font url"); */
        }

        * {
            font-family: 'Poppins', sans-serif;
            font-size: 10px;
        }

        footer {
            position: fixed;
            bottom: 60px;
            left: 0px;
            right: 0px;
            height: 50px;

            /** Extra personal styles **/
            color: #000;
            padding-left: 10px;
        }

        table tr td,
        table tr th {
            font-size: 10px;
        }
    </style>
</head>

<body>
    <div>
        <div style="clear:both;">
            <p style="margin-top:0pt; margin-bottom:0pt;">&nbsp;</p>
        </div>
        <h2 style="margin-top:0pt; margin-bottom:0pt; text-align:center;"><span style="font-size: 32px;">SURAT JALAN</span></h2>
        @if ($lead->logPrintOrders()->count() > 1)
        <p style="position: absolute;right:50px;top:30px;">COPY {{$lead->logPrintOrders()->count()-1}}</p>
        @endif
    </div>
    <br><br>

    <table width="100%">
        <tr>
            <td width="50%">FROM : <br>PT. ANUGRAH INOVASI MAKMUR INDONESIA<br>Jakarta<br><br> TO CUSTOMER : <br>{{ $lead->contact_name }}<br><br> DELIVER TO : <br>{{ @$mainaddress->alamat }}</td>
            <td width="50%">Details :<br>
                <table width="100%" border="1" cellpadding="0" cellspacing="0">
                    {{-- <tr>
                        <td width="30%">Deliver No.</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>PO No.</td>
                        <td>-</td>
                    </tr> --}}
                    <tr>
                        <td>Sales Order No.</td>
                        <td>{{(empty($lead->order_number)?'-':$lead->order_number)}}</td>
                    </tr>
                    <tr>
                        <td>Delivery Date</td>
                        <td>{{ (!empty($lead->created_at)?date('l, d F Y', strtotime($lead->created_at)):'-') }}</td>
                    </tr>
                    <tr>
                        <td>Salesperson</td>
                        <td>{{$lead->sales_name}}</td>
                    </tr>
                    <tr>
                        <td>Notes</td>
                        <td>{{$lead->notes}}</td>
                    </tr>
                    <tr>
                        <td>Printed</td>
                        <td>{{$lead->print_status}}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table width="100%" style="margin-top:20px;border-bottom: 1px solid #000;">
        <tr style="background-color: #3D4043;">
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;border:0px solid #3D4043;" bgcolor="#3D4043">No</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">SKU</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Item</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Qty</th>
        </tr>
        @foreach ($productneeds as $key => $prod)
        <tr>
            <td align="center">
                {{$key+1}}
            </td>
            <td align="center">
                {{$prod->product->sku}}
            </td>
            <td align="center">
                {{ $prod->product->name }}
            </td>
            <td align="center">
                {{ $prod->qty }}
            </td>
        </tr>
        @endforeach
    </table>
    <br><br>
    <table width="100%">
        <tr>
            <td width="25%">Gudang</td>
            <td width="25%">Admin</td>
            <td width="25%">Pengemudi</td>
            <td width="25%">Penerima</td>
        </tr>
    </table>

    <br><br><br><br><br><br>

    <!-- <table width="100%">
        <tr>
            <td width="60%"><img src="{{getImage($lead->brand->logo)}}" style="height:90px;" alt=""></td>
            <td>Jl. Boulevard Raya Ruko Malibu Blok J No.129-130<br>Cengkareng, Jakarta Barat</td>
        </tr>
    </table>
    <center>
        <h1>TANDA TERIMA<br>No. 37/Inovasi/II/2022</h1>
    </center>
    <p>Nama : {{ @$lead->ContactUser->name }}</p>
    <p>Alamat : {{ @$mainaddress->alamat }}</p>

    <table width="100%" style="margin-top:20px;border-bottom: 1px solid #000;">
        <tr style="background-color: #3D4043;">
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;border:0px solid #3D4043;" bgcolor="#3D4043">No</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Tanggal</th>
            {{-- <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">No. PO</th> --}}
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Qty</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Nama Barang</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Harga Satuan</th>
            <th style="color: #fff;padding-top: 20px;padding-bottom:20px;">Jumlah</th>
        </tr>
        @php $subtotal = 0;$discount = 0; $ppnval=0; $total=0; @endphp
        @foreach ($productneeds as $key => $prod)
        @php
        $subtotal += $prod->subtotal;
        $discount += $prod->discount_amount;
        $ppnval += $prod->tax_amount;
        $total += $prod->total;
        @endphp
        <tr>
            <td align="center">
                {{$key+1}}
            </td>
            <td align="center">
                {{ date('Y-m-d', strtotime($prod->created_at)) }}
            </td>
            {{-- <td align="center">
                PO-1223233
            </td> --}}
            <td align="center">
                {{$prod->qty}}
            </td>
            <td align="center">
                {{$prod->product->name}}
            </td>
            <td align="center">
                Rp {{ number_format($prod->price_product,0,',','.') }}
            </td>
            <td align="center">
                Rp {{ number_format($prod->subtotal,0,',','.') }}
            </td>
        </tr>
        @endforeach
        <tr>
            <td colspan="4"></td>
            <td align="center">
                <b>Subtotal</b>
            </td>
            <td align="center">
                Rp {{ number_format($lead->subtotal,0,',','.')}}
            </td>
        </tr>
        <tr>
            <td colspan="4"></td>
            <td align="center">
                <b>Kode Unik</b>
            </td>
            <td align="center">
                Rp {{ number_format($lead->kode_unik,0,',','.')}}
            </td>
        </tr>
        <tr>
            <td colspan="4"></td>
            <td align="center">
                <b>Diskon</b>
            </td>
            <td align="center">
                Rp {{ number_format($lead->discount_amount,0,',','.')}}
            </td>
        </tr>
        <tr>
            <td colspan="4"></td>
            <td align="center">
                <b>PPN (11%)</b>
            </td>
            <td align="center">
                Rp {{ number_format(@$lead->tax_amount,0,',','.')}}
            </td>
        </tr>
        <tr>
            <td colspan="4"></td>
            <td align="center">
                <b>Total</b>
            </td>
            <td align="center">
                Rp {{ number_format($lead->amount,0,',','.')}}
            </td>
        </tr>
    </table>
    <br><br>
    <table width="100%">
        <tr>
            <td width="50%">Penerima</td>
            <td width="50%">Pengirim</td>
        </tr>
    </table>

    <br><br><br><br><br><br> -->
</body>

</html>