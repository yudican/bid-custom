<div class="page-inner">
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-capitalize">
                        <a href="{{route('dashboard')}}">
                            <span><i class="fas fa-arrow-left mr-3"></i>{{ ($form_active)?'Form Pengisian Data Company':'List Data Companies' }}</span>
                        </a>
                        <div class="pull-right">
                            @if ($form_active)
                            <button class="btn btn-danger btn-sm" wire:click="toggleForm(false)"><i class="fas fa-times"></i> Cancel</button>
                            @else
                            @if (auth()->user()->hasTeamPermission($curteam, $route_name.':create'))
                            <button class="btn btn-primary btn-sm" wire:click="{{$modal ? 'showModal' : 'toggleForm(true)'}}"><i class="fas fa-plus"></i> Tambah Data</button>
                            @endif
                            @endif
                        </div>
                    </h4>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            @if ($form_active)
            <div class="card">
                <div class="card-body">
                    <x-select name="user_id" label="Business Entity" isreq="*">
                        <option value="">Select Business Entity</option>
                        @foreach ($business_entity as $business)
                        <option value="{{$business->id}}">{{$business->title}}</option>
                        @endforeach
                    </x-select>
                    <x-text-field type="text" name="name" label="Name" isreq="*" />
                    <x-textarea type="textarea" name="address" label="Address" isreq="*" />
                    <x-text-field type="text" name="email" label="Email" isreq="*" />
                    <x-text-field type="text" name="phone" label="Phone" isreq="*" />
                    <x-text-field type="text" name="brand_id" label="Brand Id" isreq="*" />
                    <x-text-field type="text" name="owner_name" label="Owner Name" isreq="*" />
                    <x-text-field type="text" name="owner_phone" label="Owner Phone" isreq="*" />
                    <x-text-field type="text" name="pic_name" label="Pic Name" isreq="*" />
                    <x-text-field type="text" name="pic_phone" label="Pic Phone" isreq="*" />
                    <!-- <x-text-field type="text" name="user_id" label="User Id" /> -->
                    <!-- <x-select name="user_id" label="Agent">
                            <option value="">Select Agent</option>
                            @foreach ($agents as $agent)
                            <option value="{{$agent->id}}">{{$agent->name}}</option>
                            @endforeach
                        </x-select> -->
                    <x-select name="status" label="Status" isreq="*">
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Not Active</option>
                    </x-select>

                    <div class="form-group">
                        <button class="btn btn-primary pull-right" wire:click="{{$update_mode ? 'update' : 'store'}}">Simpan</button>
                    </div>
                </div>
            </div>
            @else
            <livewire:table.company-table params="{{$route_name}}" />
            @endif

        </div>

        {{-- Modal confirm --}}
        <div id="confirm-modal" wire:ignore.self class="modal fade" tabindex="-1" permission="dialog" aria-labelledby="my-modal-title" aria-hidden="true">
            <div class="modal-dialog" permission="document">
                <div class="modal-content {{ $is_dark_mode ? 'bg-black' : 'bg-white' }}">
                    <div class="modal-header {{ $is_dark_mode ? 'bg-black' : 'bg-white' }}">
                        <h5 class="modal-title" id="my-modal-title">Konfirmasi Hapus</h5>
                    </div>
                    <div class="modal-body">
                        <p>Apakah anda yakin hapus data ini.?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" wire:click='delete' class="btn btn-danger btn-sm"><i class="fa fa-check pr-2"></i>Ya, Hapus</button>
                        <button class="btn btn-primary btn-sm" wire:click='_reset'><i class="fa fa-times pr-2"></i>Batal</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @push('scripts')



    <script>
        $(document).ready(function(value) {
            window.livewire.on('loadForm', (data) => {
                
                
            });

            window.livewire.on('closeModal', (data) => {
                $('#confirm-modal').modal('hide')
            });
        })
    </script>
    @endpush
</div>