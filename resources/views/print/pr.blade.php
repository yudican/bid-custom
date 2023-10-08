<div>
  <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 width=100% style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
 mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt'>
    <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes'>
      <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt;
  mso-border-alt:solid windowtext .5pt;background:#AEAAAA;mso-background-themecolor:
  background2;mso-background-themeshade:191;padding:0cm 5.4pt 0cm 5.4pt'>
        <p class=MsoNormal><b><span lang=EN-US style='color:black;mso-color-alt:windowtext;
  mso-ansi-language:EN-US'>PT. AIMI CAPITAL INDONESIA</span></b><b><span lang=EN-US style='mso-ansi-language:EN-US'>
              <o:p></o:p>
            </span></b></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:1'>
      <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt;
  border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
  padding:0cm 5.4pt 0cm 5.4pt'>
        <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>PURCHASE
            REQUISITION<o:p></o:p></span></p>
      </td>
    </tr>
    <tr style='mso-yfti-irow:2;mso-yfti-lastrow:yes'>
      <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt;
  border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:solid windowtext .5pt;
  padding:0cm 5.4pt 0cm 5.4pt'>
        <p class=MsoNormal>
          <o:p>&nbsp;</o:p>
        </p>
        <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0 width=100% style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
   mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt'>
          <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes'>
            <td width=116 colspan=3 valign=top style='width:87.35pt;border:none;
    border:none;mso-border-bottom-alt:
    solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>Project
                  Name<o:p></o:p></span></p>

            </td>
            <td width=254 colspan=5 valign=top style='width:190.3pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>: {{$data->project_name}}<o:p></o:p></span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.6pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>Date<o:p></o:p></span></p>
            </td>
            <td width=137 colspan=2 valign=top style='width:102.45pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>: {{date('Y-m-d',strtotime($data->created_at))}}<o:p></o:p></span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes'>
            <td width=116 colspan=3 valign=top style='width:87.35pt;
    border:none;border-bottom:solid windowtext 1.0pt;border:none;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>Requestor<o:p></o:p></span></p>

            </td>
            <td width=254 colspan=5 valign=top style='width:190.3pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>: {{$data->request_by_name}}<o:p></o:p></span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.6pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>No. PR<o:p></o:p></span></p>
            </td>
            <td width=137 colspan=2 valign=top style='width:102.45pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>: {{$data->nomor_pr}}<o:p></o:p></span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:2'>
            <td width=116 colspan=3 valign=top style='width:87.35pt;
    border:none;border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:
    solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>Divivion<o:p></o:p></span></p>

            </td>
            <td width=254 colspan=5 valign=top style='width:190.3pt;border:none;
    border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .5pt;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>: {{$data->request_by_division}}<o:p></o:p></span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.6pt;border:none;
    border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .5pt;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>Brand<o:p></o:p></span></p>
            </td>
            <td width=137 colspan=2 valign=top style='width:102.45pt;border:none;
    border-bottom:solid windowtext 1.0pt;mso-border-bottom-alt:solid windowtext .5pt;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>: {{$data->brand_name}}<o:p></o:p></span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:3'>
            <td width=49 valign=top style='width:36.7pt;border:solid windowtext 1.0pt;
    border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:
    solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-US style='mso-ansi-language:EN-US'>No.<o:p></o:p></span></b></p>
            </td>
            <td width=210 colspan=4 valign=top style='width:157.45pt;border-top:none;
    border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-US style='mso-ansi-language:EN-US'>Request<o:p></o:p></span></b></p>
            </td>
            <td width=111 colspan=3 valign=top style='width:83.5pt;border-top:none;
    border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-US style='mso-ansi-language:EN-US'>Qty<o:p></o:p></span></b></p>
            </td>
            <td width=239 colspan=4 valign=top style='width:179.05pt;border-top:none;
    border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-US style='mso-ansi-language:EN-US'>Description<o:p></o:p></span></b></p>
            </td>
          </tr>

          @foreach ($data->items as $key => $item)
          <tr style='mso-yfti-irow:4'>
            <td width=49 valign=top style='width:36.7pt;border:solid windowtext 1.0pt;
    border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:
    solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{$key+1}}.<o:p></o:p></span></p>
            </td>
            <td width=210 colspan=4 valign=top style='width:157.45pt;border-top:none;
    border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>{{$item->item_name}}</span></p>
            </td>
            <td width=55 colspan=2 valign=top style='width:41.0pt;border-top:none;
    border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{$item->item_qty}}<o:p></o:p></span></p>
            </td>
            <td width=57 valign=top style='width:42.5pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{$item->item_unit}}<o:p></o:p></span></p>
            </td>
            <td width=239 colspan=4 valign=top style='width:179.05pt;border-top:none;
    border-left:none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-left-alt:solid windowtext .5pt;
    mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>{{$item->item_note}}<o:p></o:p></span></p>
            </td>
          </tr>
          @endforeach

          <tr style='mso-yfti-irow:8'>
            <td width=49 valign=top style='width:36.7pt;border:none;border-bottom:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;
    mso-border-bottom-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=210 colspan=4 valign=top style='width:157.45pt;border:none;
    border-bottom:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .5pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-bottom-alt:solid windowtext .5pt;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=55 colspan=2 valign=top style='width:41.0pt;border:none;
    border-bottom:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .5pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-bottom-alt:solid windowtext .5pt;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=57 valign=top style='width:42.5pt;border:none;border-bottom:solid windowtext 1.0pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-top-alt:solid windowtext .5pt;
    mso-border-bottom-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=239 colspan=4 valign=top style='width:179.05pt;border:none;
    border-bottom:solid windowtext 1.0pt;mso-border-top-alt:solid windowtext .5pt;
    mso-border-top-alt:solid windowtext .5pt;mso-border-bottom-alt:solid windowtext .5pt;
    padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:9'>
            <td width=609 colspan=12 valign=top style='width:456.7pt;border:solid windowtext 1.0pt;
    border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:
    solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal align=center style='text-align:center'><b><span lang=EN-US style='mso-ansi-language:EN-US'>Notes<o:p></o:p></span></b></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:10'>
            <td width=609 colspan=12 valign=top style='width:456.7pt;border:solid windowtext 1.0pt;
    border-top:none;mso-border-top-alt:solid windowtext .5pt;mso-border-alt:
    solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>{{$data->request_note}}<o:p></o:p></span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:11'>
            <td width=609 colspan=12 valign=top style='width:456.7pt;border:none;
    mso-border-top-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:12;height:12.6pt'>
            <td width=87 colspan=2 rowspan=2 valign=top style='width:65.05pt;
    border:none;padding:0cm 5.4pt 0cm 5.4pt;height:12.6pt'>
              <p class=MsoNormal><span class=GramE><span lang=EN-US style='mso-ansi-language:
    EN-US'>Date :</span></span><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p></o:p>
                </span></p>
            </td>
            <td width=116 colspan=2 valign=top style='width:87.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.6pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>Request by,<o:p></o:p></span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.6pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>Verified by,<o:p></o:p></span></p>
            </td>
            <td width=101 colspan=3 valign=top style='width:76.1pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.6pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>Approved By<o:p></o:p></span></p>
            </td>
            <td width=87 colspan=2 valign=top style='width:65.35pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.6pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 valign=top style='width:86.9pt;border:none;padding:0cm 5.4pt 0cm 5.4pt;
    height:12.6pt'>
              <p class=MsoNormal align=center style='text-align:center'><span class=SpellE><span lang=EN-US style='mso-ansi-language:EN-US'>Excecuted</span></span><span lang=EN-US style='mso-ansi-language:EN-US'> by,<o:p></o:p></span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:13;height:12.55pt'>
            <td width=116 colspan=2 valign=top style='width:87.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{date('d/m/Y',strtotime($data->created_at))}}<o:p></o:p></span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{date('d/m/Y',strtotime($data->created_at))}}<o:p></o:p></span></p>
            </td>
            <td width=101 colspan=3 valign=top style='width:76.1pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{date('d/m/Y',strtotime($data->created_at))}}<o:p></o:p></span></p>
            </td>
            <td width=87 colspan=2 valign=top style='width:65.35pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 valign=top style='width:86.9pt;border:none;padding:0cm 5.4pt 0cm 5.4pt;
    height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>{{date('d/m/Y',strtotime($data->created_at))}}<o:p></o:p></span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:14;height:12.55pt'>
            <td width=87 colspan=2 valign=top style='width:65.05pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 colspan=2 valign=top style='width:87.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=101 colspan=3 valign=top style='width:76.1pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=87 colspan=2 valign=top style='width:65.35pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 valign=top style='width:86.9pt;border:none;padding:0cm 5.4pt 0cm 5.4pt;
    height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:15;height:12.55pt'>
            <td width=87 colspan=2 valign=top style='width:65.05pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 colspan=2 valign=top style='width:87.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=101 colspan=3 valign=top style='width:76.1pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=87 colspan=2 valign=top style='width:65.35pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 valign=top style='width:86.9pt;border:none;padding:0cm 5.4pt 0cm 5.4pt;
    height:12.55pt'>
              <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
          </tr>
          <tr style='mso-yfti-irow:16;mso-yfti-lastrow:yes;height:12.55pt'>
            <td width=87 colspan=2 valign=top style='width:65.05pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal><span class=GramE><span lang=EN-US style='mso-ansi-language:
    EN-US'>Name :</span></span><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p></o:p>
                </span></p>
            </td>
            <td width=116 colspan=2 valign=top style='width:87.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>({{$data->request_by_name}})<o:p></o:p></span></p>
            </td>
            <td width=102 colspan=2 valign=top style='width:76.15pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>({{$data->verified_by_name}})<o:p></o:p></span></p>
            </td>
            <td width=101 colspan=3 valign=top style='width:76.1pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>({{$data->approved_by_name}})<o:p></o:p></span></p>
            </td>
            <td width=87 colspan=2 valign=top style='width:65.35pt;border:none;
    padding:0cm 5.4pt 0cm 5.4pt;height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>
                  <o:p>&nbsp;</o:p>
                </span></p>
            </td>
            <td width=116 valign=top style='width:86.9pt;border:none;padding:0cm 5.4pt 0cm 5.4pt;
    height:12.55pt'>
              <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US style='mso-ansi-language:EN-US'>({{$data->excecuted_by_name}})<o:p></o:p></span></p>
            </td>
          </tr>
        </table>
        <p class=MsoNormal><span lang=EN-US style='mso-ansi-language:EN-US'>
            <o:p></o:p>
          </span></p>
      </td>
    </tr>
  </table>
</div>