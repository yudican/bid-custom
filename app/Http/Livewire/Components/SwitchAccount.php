<?php

namespace App\Http\Livewire\Components;

use App\Jobs\GetGpTokenQueue;
use App\Models\CompanyAccount;
use Livewire\Component;

class SwitchAccount extends Component
{
    public function render()
    {
        return view('livewire.components.switch-account');
    }

    public function handleSwitch($id)
    {
        if ($id > 0) {
            CompanyAccount::where('status', 1)->update(['status' => 0]);
            $account = CompanyAccount::find($id);
            if (getSetting('GP_PRODUCTION')) {
                $username = $account->account_code == '001' ? 'inv' : 'flm';
                setSetting('GP_USERNAME', $username);
                GetGpTokenQueue::dispatch($username)->onQueue('send-notification');
            }

            $account->update([
                'status' => $account->status == 1 ? 0 : 1
            ]);
            $this->emit('handleSwitch', $id);
        } else {
            CompanyAccount::where('status', 1)->update(['status' => 0]);


            $this->emit('handleSwitch', null);
        }

        $this->emit('showAlert', ['msg' => 'Account switched successfully']);
    }
}
