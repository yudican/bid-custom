<?php

namespace App\Exports\Setting;

use App\Models\NotificationTemplate as ModelsNotificationTemplate;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NotificationTemplateExportTable implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    public function __construct()
    {
    }

    public function query()
    {
        return ModelsNotificationTemplate::query();
    }

    public function map($row): array
    {
        return [
            $row->notification_code,
            $row->notification_title,
            $row->notification_subtitle,
            $this->getNotificationType($row->notification_type),
            $row->roles()->pluck('role_name')->implode(', '),
            $row->notification_body,
        ];
    }

    public function headings(): array
    {
        return [
            'Code',
            'Title',
            'Subtitle',
            'Type',
            'Role',
            'Body',
        ];
    }

    // get notification type
    public function getNotificationType($type)
    {
        if ($type == 'alert') {
            return 'Alert';
        } else if ($type == 'email') {
            return 'Email';
        } else {
            return 'Email & Alert';
        }
    }
}
